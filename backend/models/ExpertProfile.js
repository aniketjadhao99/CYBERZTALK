import mongoose from 'mongoose';

const expertProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    headline: {
        type: String,
        trim: true,
        maxlength: [120, 'Headline cannot exceed 120 characters']
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    specialties: [{
        type: String,
        enum: ['phishing', 'malware', 'identity-theft', 'financial-fraud', 'harassment', 'forensics', 'other']
    }],
    yearsOfExperience: {
        type: Number,
        min: 0,
        max: 60
    },
    feePerMinute: {
        type: Number,
        min: 0,
        default: 1
    },
    credentials: [{
        type: String,
        trim: true,
        maxlength: [150, 'Credential cannot exceed 150 characters']
    }],
    languages: [{
        type: String,
        trim: true,
        maxlength: [50, 'Language cannot exceed 50 characters']
    }],
    location: {
        type: String,
        trim: true,
        maxlength: [100, 'Location cannot exceed 100 characters']
    },
    avatar: {
        type: String,
        default: null
    },
    availability: {
        type: String,
        enum: ['available', 'busy', 'offline'],
        default: 'offline'
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('ExpertProfile', expertProfileSchema);
