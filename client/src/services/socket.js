import { io } from 'socket.io-client';

export const createSocket = (token) => io(
  import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL,
  {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
  },
);
