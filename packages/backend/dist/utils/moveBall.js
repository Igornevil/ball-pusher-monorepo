'use strict';
// import type { BallData } from '../types.js';
// import C from '../constants.js';
// /**
//  * Оновлює позицію шарика на основі його швидкості та застосовує тертя.
//  * @param deltaTime - Множник кроку (наприклад, 1.0 для повного кроку, 0.5 для половини).
//  */
// export function moveBall(ball: BallData, deltaTime: number = 1.0): void {
//   // Крок 1: Зменшуємо швидкість на коефіцієнт тертя
//   ball.vx *= C.FRICTION;
//   ball.vy *= C.FRICTION;
//   // Крок 2: Зміщуємо координати шарика на вектор його швидкості, враховуючи долю кадру
//   ball.x += ball.vx * deltaTime;
//   ball.y += ball.vy * deltaTime;
// }
