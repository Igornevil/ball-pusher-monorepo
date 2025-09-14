import { gameManager } from '../game/GameManager.js';
export function registerSocketHandlers(io, socket) {
  socket.on('create_game', (settings, callback) => {
    const room = gameManager.createRoom(settings);
    socket.join(room.id);
    room.users.set(socket.id, { id: socket.id, cursor: null });
    callback(room.id);
  });
  socket.on('join_room', (roomId, callback) => {
    const room = gameManager.getRoom(roomId);
    if (!room) {
      callback({ success: false });
      return;
    }
    socket.join(roomId);
    room.users.set(socket.id, { id: socket.id, cursor: null });
    callback({ success: true });
  });
  socket.on('disconnect', () => {
    for (const room of gameManager.allRooms()) {
      if (room.users.delete(socket.id)) {
        console.log(`👋 ${socket.id} покинул ${room.id}`);
      }
    }
  });
}
