import Chat from '../models/Chat.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getAuthorizedChatById, getOrCreateAuthorizedChat, populateChat } from '../utils/chatAccess.js';

export const getChats = asyncHandler(async (req, res) => {
  const chats = await populateChat(Chat.find({ participants: req.user._id }).sort({ updatedAt: -1 }));

  res.status(200).json({
    success: true,
    count: chats.length,
    chats,
  });
});

export const getChatById = asyncHandler(async (req, res) => {
  const chat = await getAuthorizedChatById({
    chatId: req.params.id,
    user: req.user,
  });

  res.status(200).json({
    success: true,
    chat,
  });
});

export const getChatByRequest = asyncHandler(async (req, res) => {
  const chat = await getOrCreateAuthorizedChat({
    requestId: req.params.requestId,
    providerId: req.query.providerId,
    user: req.user,
  });

  res.status(200).json({
    success: true,
    chat,
  });
});
