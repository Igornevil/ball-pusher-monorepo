'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const path_1 = __importDefault(require('path'));
const ws_1 = require('ws');
const http_1 = __importDefault(require('http'));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Serve frontend
const frontendPath = path_1.default.join(__dirname, '../public');
app.use(express_1.default.static(frontendPath));
// Fallback to index.html (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path_1.default.join(frontendPath, 'index.html'));
});
// Create HTTP + WS server
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (msg) => console.log('Received:', msg.toString()));
  ws.send('Welcome to Ball Pusher WS!');
});
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
