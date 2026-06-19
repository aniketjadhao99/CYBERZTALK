import express from 'express';
import {
    createCase,
    getAllCases,
    getCaseById,
    updateCaseStatus,
    getUserCases
} from '../controllers/caseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/create', protect, createCase);
router.get('/all', protect, getAllCases);
router.get('/user', protect, getUserCases);
router.get('/:id', protect, getCaseById);
router.patch('/:id', protect, updateCaseStatus);
router.put('/:id', protect, updateCaseStatus);

export default router;
