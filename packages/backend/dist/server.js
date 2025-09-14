// backend/server.ts
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { registerRoomHandlers } from './game/registerRoom.js';
// import registerRoomHandlers from './game/rooms.js';
export async function startServer(port) {
  const app = express();
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    registerRoomHandlers(socket);
  });
  console.log(`🔁 Starting server on port ${port}...`);
  return new Promise((resolve, reject) => {
    httpServer
      .listen(port)
      .once('listening', () => {
        console.log(`✅ Server is listening on port ${port}`);
        resolve();
      })
      .once('error', (err) => {
        console.error('❌ Server failed to start', err);
        reject(err);
      });
  });
}
