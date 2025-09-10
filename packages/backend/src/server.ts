import express from 'express';
import path from 'path';
import { WebSocketServer } from 'ws';
import http from 'http';

const app = express();
const port = process.env.PORT || 3000;

// Serve frontend
const frontendPath = path.join(__dirname, '../public');
app.use(express.static(frontendPath));

// Fallback to index.html (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Create HTTP + WS server
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
