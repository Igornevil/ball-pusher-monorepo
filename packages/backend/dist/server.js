import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { WebSocketServer } from 'ws';
const app = express();
const port = process.env.PORT || 3000;
// ESM: __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Статика фронтенда
const frontendPath = path.join(__dirname, '../public');
app.use(express.static(frontendPath));
// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});
// HTTP + WebSocket сервер
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (msg) => console.log('Received:', msg.toString()));
  ws.send('Welcome to Ball Pusher WS!');
});
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
