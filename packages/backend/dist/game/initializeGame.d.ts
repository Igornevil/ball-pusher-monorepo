import type { GameSettings } from '../types.js';
import { Room } from './rooms.js';
/**
 * Инициализация новой игровой сессии:
 * - очищает старые шарики из физического мира,
 * - сбрасывает внутренние карты данных шариков,
 * - создаёт новые шарики с физикой и цветами.
 */
export declare function initializeGame(
  room: Room,
  settings: GameSettings,
): void;
