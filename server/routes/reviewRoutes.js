import express from 'express';
import { createReview, getProviderReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/:providerId', protect, getProviderReviews);

export default router;
