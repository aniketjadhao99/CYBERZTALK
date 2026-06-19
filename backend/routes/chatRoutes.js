import express from 'express';
import {
    createConversation,
    getUserConversations,
    getConversationMessages,
    sendMessage,
    markMessageAsRead
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/conversation/create', protect, createConversation);
router.get('/conversations', protect, getUserConversations);
router.get('/conversation/:conversationId', protect, getConversationMessages);
router.post('/message/send', protect, sendMessage);
router.put('/message/:messageId/read', protect, markMessageAsRead);

export default router;
