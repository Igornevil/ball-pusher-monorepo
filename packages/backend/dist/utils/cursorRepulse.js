'use strict';
// import C from '../constants.js';
// import type { BallData } from '../types.js';
// /**
//  * Застосовує до шарика силу відштовхування від курсора.
//  */
// export function cursorRepulse(
//   ball: BallData,
//   cursor: { x: number; y: number },
// ): void {
//   // Крок 1: Знаходимо вектор від курсора до шарика і відстань
//   const dx = ball.x - cursor.x;
//   const dy = ball.y - cursor.y;
//   const dist = Math.sqrt(dx * dx + dy * dy);
//   // Крок 2: Перевіряємо, чи знаходиться шарик в радіусі дії курсора
//   if (dist < C.CURSOR_REPULSE_RADIUS && dist > 0) {
//     // Крок 3: Розраховуємо силу відштовхування
//     // Сила максимальна в центрі курсора і спадає до нуля на його краю
//     const angle = Math.atan2(dy, dx);
//     const strength =
//       C.CURSOR_REPULSE_STRENGTH * (1 - dist / C.CURSOR_REPULSE_RADIUS);
//     // Крок 4: Додаємо до швидкості шарика компоненти сили по осях X та Y
//     ball.vx += Math.cos(angle) * strength;
//     ball.vy += Math.sin(angle) * strength;
//   }
// }
