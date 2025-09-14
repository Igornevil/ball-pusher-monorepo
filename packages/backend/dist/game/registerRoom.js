import { initializeGame } from './initializeGame.js';
import { gameManager } from './GameManager.js';
export function registerRoomHandlers(socket) {
  let currentRoomId = null;
  // Подключение к комнате
  socket.on('join_room', (roomId, settings) => {
    let room = gameManager.getRoom(roomId);
    if (!room) {
      // Если комнаты нет, создаем новую
      room = gameManager.createRoom(settings);
    }
    currentRoomId = room.id;
    socket.join(room.id);
    console.log(
      `🔌 Пользователь ${socket.id} подключился к комнате ${room.id}`,
    );
    // Инициализируем игру при необходимости
    initializeGame(room, settings);
  });
  // Получение движений курсора
  socket.on('cursor_move', (position) => {
    if (!currentRoomId) return;
    const room = gameManager.getRoom(currentRoomId);
    if (!room) return;
    room.users.set(socket.id, { id: socket.id, cursor: position });
  });
  // Старт игры
  socket.on('start_game', (settings) => {
    if (!currentRoomId) return;
    const room = gameManager.getRoom(currentRoomId);
    if (!room) return;
    initializeGame(room, settings);
  });
  // Отключение пользователя
  socket.on('disconnect', () => {
    if (!currentRoomId) return;
    const room = gameManager.getRoom(currentRoomId);
    if (!room) return;
    room.users.delete(socket.id);
    console.log(
      `🔌 Пользователь ${socket.id} отключился от комнаты ${room.id}`,
    );
  });
}
