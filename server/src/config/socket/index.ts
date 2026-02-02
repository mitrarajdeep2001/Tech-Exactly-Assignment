import { Server } from 'socket.io';
import { verifyRefreshToken } from '@/lib/jwt';
import * as cookie from 'cookie';

export const initSocket = (httpServer: any) => {
  console.log('🧠 initSocket() CALLED');
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });
  console.log('🧠 Socket.IO attached');

  io.use((socket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie;
      if (!rawCookie) {
        return next(new Error('Unauthorized'));
      }
      const parsedCookies = cookie.parse(rawCookie);
      const refreshToken = parsedCookies.refreshToken; // 🔑 cookie name
      if (!refreshToken) {
        return next(new Error('Unauthorized'));
      }

      const payload = verifyRefreshToken(refreshToken) as { userId: string };
      socket.data.userId = payload.userId;

      next();
    } catch (error) {
      console.log(error, 'error******');

      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', async (socket) => {
    console.log('🔥 SOCKET CONNECTED 🔥', socket.id);
    const userId = socket.data.userId;
    const room = `user:${userId}`;

    socket.join(room);

    socket.on('disconnect', () => {
      socket.leave(room);
    });
  });

  return io;
};
