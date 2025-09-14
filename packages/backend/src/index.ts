import http from 'http';
import { Server } from 'socket.io';
import { GameManager } from './game/GameManager.js';
import { registerSocketHandlers } from './network/socketHandlers.js';

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const gameManager = new GameManager();
gameManager.setIoServer(io);

io.on('connection', (socket) => {
  console.log(`🔌 Користувач підключився: ${socket.id}`);

  registerSocketHandlers(socket, io, gameManager);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на порті ${PORT}`);
});
