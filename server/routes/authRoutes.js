import express from 'express';
import { getCurrentUser, loginUser, registerUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', registerUser);
router.post('/register', registerUser);
router.get('/me', protect, getCurrentUser);

export default router;
