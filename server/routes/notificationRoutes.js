import express from 'express';
import { createNotification, getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createNotification)
  .get(protect, getNotifications);

router.patch('/read-all', protect, markAllNotificationsAsRead);
router.patch('/:id/read', protect, markNotificationAsRead);

export default router;
