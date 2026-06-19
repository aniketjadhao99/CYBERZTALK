import ChatMessage from '../models/ChatMessage.js';
import Conversation from '../models/Conversation.js';

// Create conversation
export const createConversation = async (req, res) => {
    try {
        const { participantId, relatedCaseId, title } = req.body;

        if (!participantId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide participant ID'
            });
        }

        const conversation = await Conversation.create({
            participants: [req.userId, participantId],
            relatedCase: relatedCaseId,
            title
        });

        return res.status(201).json({
            success: true,
            message: 'Conversation created successfully',
            data: conversation
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error creating conversation'
        });
    }
};

// Get user conversations
export const getUserConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.userId
        })
            .populate('participants', 'fullName avatar email')
            .populate('relatedCase', 'caseId incidentType')
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            data: conversations
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error fetching conversations'
        });
    }
};

// Get conversation messages
export const getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const messages = await ChatMessage.find({ conversationId })
            .populate('sender', 'fullName avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ChatMessage.countDocuments({ conversationId });

        return res.status(200).json({
            success: true,
            data: messages.reverse(),
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error fetching messages'
        });
    }
};

// Send message
export const sendMessage = async (req, res) => {
    try {
        const { conversationId, message, messageType } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a message'
            });
        }

        const chatMessage = await ChatMessage.create({
            conversationId,
            sender: req.userId,
            message,
            messageType: messageType || 'text'
        });

        // Update conversation's last message
        await Conversation.findByIdAndUpdate(
            conversationId,
            {
                lastMessage: {
                    content: message,
                    sender: req.userId,
                    timestamp: new Date()
                }
            }
        );

        const populatedMessage = await chatMessage.populate('sender', 'fullName avatar');

        return res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: populatedMessage
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error sending message'
        });
    }
};

// Mark message as read
export const markMessageAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await ChatMessage.findByIdAndUpdate(
            messageId,
            {
                $push: {
                    readBy: {
                        user: req.userId,
                        readAt: new Date()
                    }
                }
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            data: message
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error marking message as read'
        });
    }
};
