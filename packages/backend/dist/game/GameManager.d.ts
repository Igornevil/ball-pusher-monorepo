import { Room } from './rooms.js';
export declare class GameManager {
  private rooms;
  createRoom(settings: { numOfColors: number; quantity: number }): Room;
  getRoom(id: string): Room | undefined;
  deleteRoom(id: string): void;
  allRooms(): IterableIterator<Room>;
}
export declare const gameManager: GameManager;
