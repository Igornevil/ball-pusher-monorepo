'use strict';
// // packages/backend/src/utils/borderMagnet.ts
// import type { BallData } from '../types.js';
// import C from '../constants.js';
// /**
//  * Застосовує до шарика "магнітну" силу відштовхування від кордонів поля.
//  */
// export function borderMagnet(ball: BallData): void {
//   // Крок 1: Визначаємо радіус "магнітної зони" біля стін
//   const magnetRadius = ball.radius * C.BORDER_MAGNET_RADIUS_MULTIPLIER;
//   const strength = C.BORDER_MAGNET_STRENGTH;
//   // Крок 2: Перевіряємо кожну з чотирьох стін
//   const leftDist = ball.x - 0;
//   if (leftDist < magnetRadius) {
//     // Якщо шарик занадто близько до лівої стіни, штовхаємо його праворуч
//     ball.vx += (magnetRadius - leftDist) * strength;
//   }
//   const rightDist = C.WIDTH - ball.x;
//   if (rightDist < magnetRadius) {
//     // Якщо занадто близько до правої, штовхаємо ліворуч
//     ball.vx -= (magnetRadius - rightDist) * strength;
//   }
//   const topDist = ball.y - 0;
//   if (topDist < magnetRadius) {
//     // Якщо занадто близько до верхньої, штовхаємо вниз
//     ball.vy += (magnetRadius - topDist) * strength;
//   }
//   const bottomDist = C.HEIGHT - ball.y;
//   if (bottomDist < magnetRadius) {
//     // Якщо занадто близько до нижньої, штовхаємо вгору
//     ball.vy -= (magnetRadius - bottomDist) * strength;
//   }
// }
