import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import { GameManager } from './game/GameManager.js';
import { registerSocketHandlers } from './network/socketHandlers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// CSP headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: blob:; " +
      "connect-src 'self' ws: wss:;",
  );
  next();
});

// Serving статики фронтенда
const staticPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(staticPath));

// Fallback для SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const gameManager = new GameManager();
gameManager.setIoServer(io);

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);
  registerSocketHandlers(socket, io, gameManager);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Serving static from: ${staticPath}`);
});
