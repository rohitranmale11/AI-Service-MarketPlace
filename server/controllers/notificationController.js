import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createNotification = asyncHandler(async (req, res) => {
  const { userId, message, type = 'application' } = req.body;

  if (!userId || !message) {
    res.status(400);
    throw new Error('User id and message are required');
  }

  if (!['application', 'status', 'request'].includes(type)) {
    res.status(400);
    throw new Error('Invalid notification type');
  }

  const notification = await Notification.create({
    userId,
    message,
    type,
  });

  res.status(201).json({
    success: true,
    notification,
  });
});

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json({
    success: true,
    count: notifications.length,
    unreadCount: notifications.filter((notification) => !notification.isRead).length,
    notifications,
  });
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    notification,
  });
});

export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { userId: req.user._id, isRead: false },
    { $set: { isRead: true } },
  );

  res.status(200).json({
    success: true,
    message: 'Notifications marked as read',
  });
});
