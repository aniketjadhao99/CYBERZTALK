import Booking from '../models/Booking.js';
import User from '../models/User.js';
import ExpertProfile from '../models/ExpertProfile.js';
import Conversation from '../models/Conversation.js';

const bookingDetails = [
    { path: 'victim', select: 'fullName email phone' },
    { path: 'expert', select: 'fullName email avatar' }
];

const withLiveAvailability = profile => {
    if (['busy', 'offline'].includes(profile.availability)) return profile;
    const lastSeen = profile.user?.lastSeen ? new Date(profile.user.lastSeen).getTime() : 0;
    profile.availability = profile.user?.isOnline && Date.now() - lastSeen < 90000 ? 'available' : 'offline';
    return profile;
};

export const getPublicExperts = async (req, res) => {
    try {
        const profiles = await ExpertProfile.find({ isPublic: true, isApproved: true })
            .populate('user', 'fullName email avatar location isOnline lastSeen')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: profiles.map(withLiveAvailability), total: profiles.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching expert profiles' });
    }
};

export const getPublicExpert = async (req, res) => {
    try {
        const profile = await ExpertProfile.findOne({ user: req.params.expertId, isPublic: true, isApproved: true })
            .populate('user', 'fullName email avatar location phone isActive isOnline lastSeen');
        if (!profile || !profile.user || profile.user.isActive === false) {
            return res.status(404).json({ success: false, message: 'Expert profile not found' });
        }
        res.json({ success: true, data: withLiveAvailability(profile) });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching expert profile' });
    }
};

export const getMyExpertProfile = async (req, res) => {
    try {
        const profile = await ExpertProfile.findOne({ user: req.userId })
            .populate('user', 'fullName email avatar location');
        if (!profile) return res.status(404).json({ success: false, message: 'Expert profile not found' });
        res.json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching your expert profile' });
    }
};

export const saveExpertProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('role');
        if (!user || user.role !== 'expert') {
            return res.status(403).json({ success: false, message: 'Only experts can manage an expert profile' });
        }

        const allowedFields = ['headline', 'bio', 'specialties', 'yearsOfExperience', 'feePerMinute', 'credentials', 'languages', 'location', 'avatar', 'availability', 'isPublic'];
        const profileData = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));
        const profile = await ExpertProfile.findOneAndUpdate(
            { user: req.userId },
            { ...profileData, user: req.userId, isApproved: true },
            { new: true, upsert: true, runValidators: true }
        ).populate('user', 'fullName email avatar location');

        res.json({ success: true, message: 'Expert profile saved for approval', data: profile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error saving expert profile' });
    }
};

export const updateExpertPresence = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.userId, role: 'expert' },
            { isOnline: req.body.isOnline !== false, lastSeen: new Date() },
            { new: true, select: 'isOnline lastSeen' }
        );
        if (!user) return res.status(404).json({ success: false, message: 'Expert account not found' });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to update expert presence' });
    }
};

export const createBooking = async (req, res) => {
    try {
        const { expertId, preferredDate, durationMinutes, note } = req.body;
        const expert = await User.findOne({ _id: expertId, role: 'expert', isActive: true });
        const profile = await ExpertProfile.findOne({ user: expertId, isPublic: true, isApproved: true });

        if (!expert || !profile) {
            return res.status(404).json({ success: false, message: 'This expert is not available for booking' });
        }
        if (!preferredDate || new Date(preferredDate) <= new Date()) {
            return res.status(400).json({ success: false, message: 'Please choose a future consultation time' });
        }

        const booking = await Booking.create({
            victim: req.userId,
            expert: expertId,
            preferredDate,
            durationMinutes,
            note
        });
        const populatedBooking = await booking.populate(bookingDetails);
        res.status(201).json({ success: true, message: 'Consultation request sent', data: populatedBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error creating booking' });
    }
};

export const getMyBookings = async (req, res) => {
    try {
        const query = req.userRole === 'expert' ? { expert: req.userId } : { victim: req.userId };
            const bookings = await Booking.find(query).populate(bookingDetails).populate('conversation', 'title isActive').sort({ preferredDate: 1 });
        res.json({ success: true, data: bookings, total: bookings.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching bookings' });
    }
};

export const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, [req.userRole === 'expert' ? 'expert' : 'victim']: req.userId });
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

        const allowedStatuses = req.userRole === 'expert' ? ['confirmed', 'completed', 'cancelled'] : ['cancelled'];
        if (!allowedStatuses.includes(req.body.status)) {
            return res.status(400).json({ success: false, message: 'Invalid booking status' });
        }
        booking.status = req.body.status;
        if (booking.status === 'confirmed' && !booking.conversation) {
            const conversation = await Conversation.create({
                participants: [booking.victim, booking.expert],
                title: 'Consultation session',
                description: 'Private Cyberztalk consultation session'
            });
            booking.conversation = conversation._id;
        }
        await booking.save();
        res.json({ success: true, message: 'Booking updated', data: await booking.populate(bookingDetails) });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating booking' });
    }
};
