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

// ✅ РАЗРЕШАЕМ CSP ДЛЯ INLINE СКРИПТОВ
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    // eslint-disable-next-line quotes
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' ws: wss:;",
  );
  next();
});

// ✅ ПРОВЕРЯЕМ СУЩЕСТВОВАНИЕ ПАПКИ СТАТИКИ
const staticPath = path.join(__dirname, '../../frontend/dist');
console.log('🔄 Serving static from:', staticPath);

// ✅ SERVING СТАТИКИ С ПРОВЕРКОЙ
app.use(express.static(staticPath));

// ✅ API HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', staticPath });
});

// ✅ FALLBACK ДЛЯ SPA
app.get('*', (req, res) => {
  console.log('📦 Serving index.html for:', req.url);
  res.sendFile(path.join(staticPath, 'index.html'));
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
  console.log(`📁 Static path: ${staticPath}`);
});
