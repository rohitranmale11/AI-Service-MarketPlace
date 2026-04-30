import express from 'express';
import { getChatById, getChatByRequest, getChats } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getChats);
router.get('/request/:requestId', protect, getChatByRequest);
router.get('/:id', protect, getChatById);

export default router;
