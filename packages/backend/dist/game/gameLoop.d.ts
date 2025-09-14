import type { Server } from 'socket.io';
import { Room } from './rooms.js';
/**
 * Игровой цикл — обновляет физику и рассылает состояние клиентам.
 */
export declare function gameLoop(io: Server, room: Room): void;
