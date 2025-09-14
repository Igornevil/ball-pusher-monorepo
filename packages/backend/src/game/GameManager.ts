import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Room } from './Room.js';
import type { GameSettings } from './types.js';

export class GameManager {
  private rooms: Map<string, Room> = new Map();
  private io?: Server;

  setIoServer(io: Server): void {
    this.io = io;
  }

  createRoom(settings: GameSettings): Room {
    const roomId = uuidv4();
    const room = new Room(roomId, settings, this.io);
    this.rooms.set(roomId, room);
    console.log(
      `[GameManager] Кімната ${roomId} успішно створена та додана до менеджера.`,
    );
    return room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  removeRoom(roomId: string): boolean {
    const room = this.rooms.get(roomId);
    if (room) {
      room.cleanup();
    }
    return this.rooms.delete(roomId);
  }

  // Періодичне очищення порожніх кімнат
  cleanupEmptyRooms(): void {
    setInterval(() => {
      for (const [roomId, room] of this.rooms.entries()) {
        if (room.users.size === 0) {
          this.removeRoom(roomId);
          console.log(`🗑️ Видалена порожня кімната: ${roomId}`);
        }
      }
    }, 60000); // Кожну хвилину
  }
}
