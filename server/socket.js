import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import User from './models/User.js';
import { getAuthorizedChatById } from './utils/chatAccess.js';

const formatMessage = (message) => ({
  _id: message._id,
  senderId: message.senderId,
  text: message.text,
  createdAt: message.createdAt,
});

export const configureSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://127.0.0.1:5173',
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        throw new Error('Socket authentication token missing');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        throw new Error('Socket user not found');
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Socket authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('joinRoom', async ({ chatId }, callback) => {
      try {
        const chat = await getAuthorizedChatById({
          chatId,
          user: socket.user,
        });

        const roomId = chat._id.toString();
        socket.join(roomId);
        socket.currentRoomId = roomId;
        socket.currentChatId = chat._id.toString();

        callback?.({
          success: true,
          roomId,
          chat,
        });
      } catch (error) {
        callback?.({
          success: false,
          message: error.message,
        });
      }
    });

    socket.on('sendMessage', async ({ chatId, message, text }, callback) => {
      try {
        const messageText = message || text;

        if (!messageText?.trim()) {
          throw new Error('Message text is required');
        }

        const chat = await getAuthorizedChatById({
          chatId,
          user: socket.user,
        });

        const nextMessage = {
          senderId: socket.user._id,
          text: messageText.trim(),
          createdAt: new Date(),
        };

        chat.messages.push(nextMessage);
        await chat.save();
        await chat.populate('messages.senderId', 'name email role');

        const savedMessage = chat.messages[chat.messages.length - 1];
        const payload = {
          chatId: chat._id,
          requestId: chat.requestId._id || chat.requestId,
          message: formatMessage(savedMessage),
        };

        io.to(chat._id.toString()).emit('receiveMessage', payload);
        callback?.({ success: true, ...payload });
      } catch (error) {
        callback?.({
          success: false,
          message: error.message,
        });
      }
    });

    socket.on('disconnect', () => {});
  });

  return io;
};
