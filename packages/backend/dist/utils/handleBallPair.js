'use strict';
// // packages/backend/src/utils/handleBallPair.ts
// import type { BallData } from '../types.js';
// import C from '../constants.js';
// /**
//  * --- ПОЛНОСТЬЮ ПЕРЕПИСАННАЯ ФУНКЦИЯ ---
//  * Обрабатывает физику взаимодействия двух шариков с четким разделением логики.
//  */
// export function handleBallPair(b1: BallData, b2: BallData): void {
//   const dx = b2.x - b1.x;
//   const dy = b2.y - b1.y;
//   const dist = Math.sqrt(dx * dx + dy * dy);
//   const minDist = b1.radius + b2.radius; // Дистанция физического касания
//   if (dist === 0) return;
//   const nx = dx / dist;
//   const ny = dy / dist;
//   // --- Логика для шариков РАЗНОГО цвета ---
//   if (b1.color !== b2.color) {
//     // Жесткое столкновение происходит только при физическом касании
//     if (dist < minDist) {
//       // 1. Упругий отскок (обмен скоростями)
//       const p1 = b1.vx * nx + b1.vy * ny;
//       const p2 = b2.vx * nx + b2.vy * ny;
//       b1.vx += (p2 - p1) * nx * C.RESTITUTION;
//       b1.vy += (p2 - p1) * ny * C.RESTITUTION;
//       b2.vx += (p1 - p2) * nx * C.RESTITUTION;
//       b2.vy += (p1 - p2) * ny * C.RESTITUTION;
//       // 2. Физически раздвигаем шарики, чтобы они не застревали друг в друге
//       const overlap = (minDist - dist) / 2;
//       b1.x -= overlap * nx;
//       b1.y -= overlap * ny;
//       b2.x += overlap * nx;
//       b2.y += overlap * ny;
//     }
//     return; // Завершаем, так как для разных цветов другой логики нет
//   }
//   // --- Логика для шариков ОДИНАКОВОГО цвета ---
//   const magnetRadius = C.MAGNET_RADIUS_MULTIPLIER * b1.radius;
//   const personalSpaceDist = C.MIN_SAME_COLOR_DISTANCE * b1.radius;
//   // Используем четкую структуру if / else if, чтобы силы не конфликтовали
//   if (dist < minDist) {
//     // Зона 1: Физическое касание (< 30px для радиуса 15)
//     // "Липкое" столкновение + раздвигание
//     const p1 = b1.vx * nx + b1.vy * ny;
//     const p2 = b2.vx * nx + b2.vy * ny;
//     b1.vx += (p2 - p1) * nx * C.COLLISION_STICK_FACTOR;
//     b1.vy += (p2 - p1) * ny * C.COLLISION_STICK_FACTOR;
//     b2.vx += (p1 - p2) * nx * C.COLLISION_STICK_FACTOR;
//     b2.vy += (p1 - p2) * ny * C.COLLISION_STICK_FACTOR;
//     const overlap = (minDist - dist) / 2;
//     b1.x -= overlap * nx;
//     b1.y -= overlap * ny;
//     b2.x += overlap * nx;
//     b2.y += overlap * ny;
//   } else if (dist < personalSpaceDist) {
//     // Зона 2: "Личное пространство" (< 45px для радиуса 15)
//     // Мягкое отталкивание друг от друга
//     const overlap = personalSpaceDist - dist;
//     b1.x -= nx * overlap * 0.5;
//     b1.y -= ny * overlap * 0.5;
//     b2.x += nx * overlap * 0.5;
//     b2.y += ny * overlap * 0.5;
//   } else if (dist < magnetRadius) {
//     // Зона 3: Магнетизм (до ~120px для радиуса 15)
//     // Притяжение друг к другу
//     const strength =
//       (1 - (dist - personalSpaceDist) / (magnetRadius - personalSpaceDist)) *
//       C.MAGNET_STRENGTH;
//     b1.vx = b1.vx * 0.95 + nx * strength * 0.05;
//     b1.vy = b1.vy * 0.95 + ny * strength * 0.05;
//     b2.vx = b2.vx * 0.95 - nx * strength * 0.05;
//     b2.vy = b2.vy * 0.95 - ny * strength * 0.05;
//   }
// }
