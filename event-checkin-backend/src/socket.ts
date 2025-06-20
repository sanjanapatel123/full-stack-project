import { Server as SocketIOServer } from 'socket.io';

export const setupSocket = (io: SocketIOServer) => {
  io.on('connection', (socket) => {
    console.log('👤 Client connected:', socket.id);

    // Example: handle disconnect
    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });
};
