import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    relatedCase: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case'
    },
    title: String,
    description: String,
    isActive: {
        type: Boolean,
        default: true
    },
    lastMessage: {
        content: String,
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: Date
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for efficient querying
conversationSchema.index({ participants: 1 });
conversationSchema.index({ relatedCase: 1 });

export default mongoose.model('Conversation', conversationSchema);
