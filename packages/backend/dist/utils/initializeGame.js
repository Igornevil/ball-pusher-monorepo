'use strict';
// // packages/backend/src/utils/initializeGame.ts
// import { v4 as uuidv4 } from 'uuid';
// import type { BallData, GameSettings } from '../types.js';
// import C from '../constants.js';
// /**
//  * Створює та повертає початковий масив шариків.
//  */
// export function initializeGame(settings: GameSettings): BallData[] {
//   // Крок 1: Створюємо порожній масив і отримуємо налаштування
//   const balls: BallData[] = [];
//   const { quantity, numOfColors } = settings;
//   const activeColorKeys = C.COLOR_KEYS.slice(0, numOfColors);
//   // Крок 2: В циклі створюємо задану кількість шариків
//   for (let i = 0; i < quantity; i++) {
//     // 2.1. Вибираємо випадковий колір з доступних
//     const randomColorKey =
//       activeColorKeys[Math.floor(Math.random() * activeColorKeys.length)];
//     // 2.2. Створюємо об'єкт нового шарика з випадковими координатами
//     const newBall: BallData = {
//       id: uuidv4(),
//       x: Math.random() * C.WIDTH,
//       y: Math.random() * C.HEIGHT,
//       radius: C.BALL_RADIUS,
//       color: randomColorKey,
//       status: 'NONE',
//       vx: 0,
//       vy: 0,
//     };
//     balls.push(newBall);
//   }
//   console.log(
//     `🚀 Гра ініціалізована з ${quantity} шариками та ${numOfColors} кольорами.`,
//   );
//   // Крок 3: Повертаємо готовий масив шариків
//   return balls;
// }
