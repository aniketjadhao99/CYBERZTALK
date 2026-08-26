import express from 'express';
import {
    getPublicExperts,
    getPublicExpert,
    getMyExpertProfile,
    updateExpertPresence,
    saveExpertProfile,
    createBooking,
    getMyBookings,
    updateBooking
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/experts', getPublicExperts);
router.get('/experts/:expertId', getPublicExpert);
router.post('/', protect, authorize('victim'), createBooking);
router.get('/mine', protect, authorize('victim', 'expert'), getMyBookings);
router.patch('/:id', protect, authorize('victim', 'expert'), updateBooking);
router.put('/expert-profile', protect, authorize('expert'), saveExpertProfile);
router.get('/expert-profile', protect, authorize('expert'), getMyExpertProfile);
router.patch('/expert-presence', protect, authorize('expert'), updateExpertPresence);

export default router;
