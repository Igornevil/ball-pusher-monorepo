import Matter from 'matter-js';
import C from '../constants.js';
import { initializeGame } from './initializeGame.js';
import { Room } from './rooms.js';
const { Bodies, World } = Matter;
export class GameManager {
  rooms = new Map();
  createRoom(settings) {
    const roomId = Math.random().toString(36).substring(2, 8);
    const room = new Room(roomId);
    // Создаем стены
    World.add(room.engine.world, [
      Bodies.rectangle(C.WIDTH / 2, C.HEIGHT + 25, C.WIDTH, 50, {
        isStatic: true,
      }),
      Bodies.rectangle(C.WIDTH / 2, -25, C.WIDTH, 50, { isStatic: true }),
      Bodies.rectangle(-25, C.HEIGHT / 2, 50, C.HEIGHT, { isStatic: true }),
      Bodies.rectangle(C.WIDTH + 25, C.HEIGHT / 2, 50, C.HEIGHT, {
        isStatic: true,
      }),
    ]);
    // Инициализация шариков через новый интерфейс
    initializeGame(room, settings);
    // Сохраняем комнату
    this.rooms.set(roomId, room);
    return room;
  }
  getRoom(id) {
    return this.rooms.get(id);
  }
  deleteRoom(id) {
    this.rooms.delete(id);
  }
  allRooms() {
    return this.rooms.values();
  }
}
export const gameManager = new GameManager();
