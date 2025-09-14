import type { Socket, Server } from 'socket.io';
import type { GameManager } from '../game/GameManager.js';
import type { GameSettings, User } from '../game/types.js';
import { PLAYER_COLORS } from '../game/constants.js';

type SocketWithRoom = Socket & { roomId?: string };

export function registerSocketHandlers(
  socket: SocketWithRoom,
  io: Server,
  gameManager: GameManager,
) {
  socket.on('create_game', (settings: GameSettings, callback) => {
    try {
      const room = gameManager.createRoom(settings);
      socket.roomId = room.id;
      const playerNumber = room.users.size + 1;
      const newUser: User = {
        id: socket.id,
        name: `Player-${playerNumber}`,
        cursorColor: PLAYER_COLORS[playerNumber - 1],
        cursor: null,
      };
      room.addUser(socket.id, newUser);
      socket.join(room.id);
      io.to(room.id).emit('game_state_update', room.getGameStateForClient());
      callback({ success: true, roomId: room.id });
    } catch (error) {
      console.error('❌ Помилка створення кімнати:', error);
      callback({ success: false, error: 'Internal server error' });
    }
  });

  // --- Подключение к комнате (без изменений) ---
  socket.on('join_room', (roomId: string, callback) => {
    try {
      const room = gameManager.getRoom(roomId);
      if (!room)
        return callback({ success: false, error: 'Кімнату не знайдено' });
      if (room.users.size >= 4)
        return callback({ success: false, error: 'Кімната заповнена' });
      socket.roomId = room.id;
      const playerNumber = room.users.size + 1;
      const newUser: User = {
        id: socket.id,
        name: `Player-${playerNumber}`,
        cursorColor: PLAYER_COLORS[(playerNumber - 1) % PLAYER_COLORS.length],
        cursor: null,
      };
      room.addUser(socket.id, newUser);
      socket.join(room.id);
      io.to(room.id).emit('game_state_update', room.getGameStateForClient());
      callback({ success: true });
    } catch (error) {
      console.error('❌ Помилка підключення до кімнати:', error);
      callback({ success: false, error: 'Internal server error' });
    }
  });

  socket.on('start_game', (callback) => {
    try {
      if (!socket.roomId)
        return callback({ success: false, error: 'Not in a room' });
      const room = gameManager.getRoom(socket.roomId);
      if (!room) return callback({ success: false, error: 'Room not found' });
      room.startGame();
      callback({ success: true });
    } catch (error) {
      console.error('❌ Помилка початку гри:', error);
      callback({ success: false, error: 'Internal server error' });
    }
  });

  socket.on('cursor_move', (position: { x: number; y: number } | null) => {
    if (!socket.roomId) return;
    const room = gameManager.getRoom(socket.roomId);
    if (room) {
      const user = room.users.get(socket.id);
      if (user) {
        user.cursor = position;
      }
    }
  });

  socket.on('disconnect', () => {
    if (!socket.roomId) return;
    const room = gameManager.getRoom(socket.roomId);
    if (room) {
      room.removeUser(socket.id);
      io.to(room.id).emit('game_state_update', room.getGameStateForClient());
    }
  });
}
