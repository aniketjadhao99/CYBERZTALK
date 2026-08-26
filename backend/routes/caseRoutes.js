import express from 'express';
import {
    createCase,
    getAllCases,
    getCaseById,
    updateCaseStatus,
    getUserCases,
    getExpertCases
} from '../controllers/caseController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/create', protect, createCase);
router.get('/all', protect, getAllCases);
router.get('/user', protect, getUserCases);
router.get('/expert', protect, authorize('expert'), getExpertCases);
router.get('/:id', protect, getCaseById);
router.patch('/:id', protect, authorize('expert', 'admin'), updateCaseStatus);
router.put('/:id', protect, authorize('expert', 'admin'), updateCaseStatus);

export default router;
