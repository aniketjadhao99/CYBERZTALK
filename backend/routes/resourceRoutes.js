import express from 'express';
import {
    getAllResources,
    getResourceById,
    getResourcesByCategory,
    markHelpful,
    getFeaturedResources
} from '../controllers/resourceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/all', getAllResources);
router.get('/featured', getFeaturedResources);
router.get('/category/:category', getResourcesByCategory);
router.get('/:id', getResourceById);

// Protected routes
router.put('/:id/helpful', protect, markHelpful);

export default router;
