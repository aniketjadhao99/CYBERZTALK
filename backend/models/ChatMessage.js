import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    messageType: {
        type: String,
        enum: ['text', 'file', 'image', 'system'],
        default: 'text'
    },
    attachments: [{
        fileName: String,
        fileUrl: String,
        fileSize: Number,
        fileType: String
    }],
    isEncrypted: {
        type: Boolean,
        default: true
    },
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: Date
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, { timestamps: true });

// Index for efficient querying
chatMessageSchema.index({ conversationId: 1, createdAt: -1 });

export default mongoose.model('ChatMessage', chatMessageSchema);
