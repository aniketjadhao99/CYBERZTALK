import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
    caseId: {
        type: String,
        unique: true,
        index: true
    },
    victim: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    victimInfo: {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: String,
        alternateContact: String,
        ageGroup: String,
        city: String,
        state: String
    },
    incidentType: {
        type: [String],
        enum: ['phishing', 'malware', 'identity-theft', 'financial-fraud', 'harassment', 'data-breach', 'ransomware', 'other'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    platform: {
        type: [String],
        enum: ['email', 'facebook', 'instagram', 'website', 'other', 'social-media', 'messaging-app', 'phone'],
        required: true
    },
    suspectInfo: {
        options: [String],
        email: String,
        name: String,
        url: String,
        other: String
    },
    evidence: [{
        type: String,
        url: String,
        uploadedAt: Date
    }],
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['new', 'assigned', 'in-progress', 'escalated', 'under-review', 'resolved', 'closed'],
        default: 'new'
    },
    assignedExpert: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    tags: [String],
    notes: String,
    aiAnalysis: {
        riskLevel: String,
        threatPattern: String,
        recommendations: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: Date
}, { timestamps: true });

// Generate Case ID before saving
caseSchema.pre('save', async function(next) {
    if (!this.caseId) {
        const count = await this.constructor.countDocuments();
        const timestamp = Date.now().toString().slice(-6);
        this.caseId = `#CZ-${timestamp}${count}`.padEnd(10, '0');
    }
    next();
});

// Index for frequent queries
caseSchema.index({ victim: 1, createdAt: -1 });
caseSchema.index({ status: 1, priority: 1 });
caseSchema.index({ assignedExpert: 1 });

export default mongoose.model('Case', caseSchema);
