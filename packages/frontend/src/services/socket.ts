import { io } from 'socket.io-client';

const PRODUCTION_URL = import.meta.env.VITE_BACKEND_URL;

const DEVELOPMENT_URL = 'http://localhost:3000';
const SERVER_URL = PRODUCTION_URL || DEVELOPMENT_URL;

console.log(`[Socket] Спроба підключення до сервера за адресою: ${SERVER_URL}`);

export const socket = io(SERVER_URL, {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log(`[Socket] ✅ Успішно підключено!
 ID: ${socket.id}`);
});

socket.on('connect_error', (err) => {
  console.error('[Socket] ❌ Помилка підключення', err.message, err.cause);
});
