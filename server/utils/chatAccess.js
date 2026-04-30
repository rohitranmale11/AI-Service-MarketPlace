import Application from '../models/Application.js';
import Chat from '../models/Chat.js';
import Request from '../models/Request.js';

export const populateChat = (query) => query
  .populate('requestId', 'title budget createdBy')
  .populate('providerId', 'name email role')
  .populate('participants', 'name email role')
  .populate('messages.senderId', 'name email role');

export const getOrCreateAuthorizedChat = async ({ requestId, providerId, user }) => {
  const request = await Request.findById(requestId);

  if (!request) {
    const error = new Error('Request not found');
    error.statusCode = 404;
    throw error;
  }

  const resolvedProviderId = user.role === 'provider' ? user._id : providerId;

  if (!resolvedProviderId) {
    const error = new Error('Provider id is required');
    error.statusCode = 400;
    throw error;
  }

  const application = await Application.findOne({
    requestId: request._id,
    providerId: resolvedProviderId,
  });

  if (!application) {
    const error = new Error('Chat is only available after the provider applies to this request');
    error.statusCode = 403;
    throw error;
  }

  const isOwner = request.createdBy.toString() === user._id.toString();
  const isAppliedProvider = resolvedProviderId.toString() === user._id.toString();

  if (!isOwner && !isAppliedProvider) {
    const error = new Error('You do not have access to this chat');
    error.statusCode = 403;
    throw error;
  }

  const chat = await Chat.findOneAndUpdate(
    { requestId: request._id, providerId: resolvedProviderId },
    {
      $setOnInsert: {
        requestId: request._id,
        providerId: resolvedProviderId,
        participants: [request.createdBy, resolvedProviderId],
      },
    },
    { new: true, upsert: true },
  );

  return populateChat(Chat.findById(chat._id));
};

export const getAuthorizedChatById = async ({ chatId, user }) => {
  const chat = await populateChat(Chat.findById(chatId));

  if (!chat) {
    const error = new Error('Chat not found');
    error.statusCode = 404;
    throw error;
  }

  const isParticipant = chat.participants.some((participant) => (
    participant._id.toString() === user._id.toString()
  ));

  if (!isParticipant) {
    const error = new Error('You do not have access to this chat');
    error.statusCode = 403;
    throw error;
  }

  return chat;
};
