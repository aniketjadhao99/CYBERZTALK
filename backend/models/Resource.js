import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: String,
    category: {
        type: String,
        enum: ['cyber-fraud', 'phishing', 'social-media', 'privacy', 'malware', 'identity-theft', 'general'],
        required: true
    },
    tags: [String],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resourceType: {
        type: String,
        enum: ['guide', 'article', 'toolkit', 'report'],
        default: 'article'
    },
    readTime: Number,
    views: {
        type: Number,
        default: 0
    },
    helpful: {
        type: Number,
        default: 0
    },
    notHelpful: {
        type: Number,
        default: 0
    },
    attachments: [{
        fileName: String,
        fileUrl: String,
        fileSize: Number
    }],
    isPublished: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for search and filtering
resourceSchema.index({ category: 1, isPublished: 1 });
resourceSchema.index({ tags: 1 });
resourceSchema.index({ createdAt: -1 });

export default mongoose.model('Resource', resourceSchema);
