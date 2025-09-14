import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
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
    // eslint-disable-next-line quotes
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' ws: wss:;",
  );
  next();
});

// Диагностика файловой системы
console.log('=== FILE SYSTEM DIAGNOSTICS ===');
console.log('Current dir:', __dirname);
console.log('Root files:', fs.readdirSync(path.join(__dirname, '../..')));

const possibleStaticPaths = [
  path.join(__dirname, '../../frontend/dist'),
  path.join(__dirname, '../../../frontend/dist'),
  '/app/packages/frontend/dist',
  path.join(process.cwd(), 'packages/frontend/dist'),
];

let staticPath = null;

for (const possiblePath of possibleStaticPaths) {
  console.log('Checking path:', possiblePath);
  if (fs.existsSync(possiblePath)) {
    staticPath = possiblePath;
    console.log('✅ Found static at:', staticPath);
    console.log('Files in dist:', fs.readdirSync(staticPath));
    break;
  }
}

if (staticPath) {
  app.use(express.static(staticPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
} else {
  console.log('❌ No static files found');
  app.get('/', (req, res) => {
    res.send('Backend running. Frontend not built. Check Railway build logs.');
  });
}

// API routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    staticPath: staticPath || 'not found',
    staticExists: !!staticPath,
  });
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
});
