import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    victim: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    expert: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        default: null
    },
    preferredDate: {
        type: Date,
        required: true
    },
    durationMinutes: {
        type: Number,
        enum: [30, 60],
        default: 30
    },
    note: {
        type: String,
        trim: true,
        maxlength: [500, 'Booking note cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending',
        index: true
    }
}, { timestamps: true });

bookingSchema.index({ expert: 1, preferredDate: 1 });
bookingSchema.index({ victim: 1, createdAt: -1 });

export default mongoose.model('Booking', bookingSchema);
