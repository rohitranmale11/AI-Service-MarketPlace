import express from 'express';
import { getMyProfile, getUserProfile, updateMyProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, getMyProfile);
router.put('/update', protect, updateMyProfile);
router.get('/:id', protect, getUserProfile);

export default router;
