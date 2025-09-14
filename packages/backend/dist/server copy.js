'use strict';
// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import Matter from 'matter-js';
// import type {
//   BallData,
//   UserData,
//   ServerToClientEvents,
//   ClientToServerEvents,
//   GameSettings,
//   BallStateClient,
// } from './types.js';
// import C from './constants.js';
// // --- 1. ИНИЦИАЛИЗАЦИЯ MATTER.JS ---
// const { Engine, World, Bodies, Body, Vector } = Matter;
// // Создаем главный "мозг" физического мира
// const engine = Engine.create();
// // Отключаем гравитацию, так как у нас вид сверху
// engine.world.gravity.y = 0;
// // --- 2. НАСТРОЙКА СЕРВЕРА ---
// const PORT: number = 3000;
// const app = express();
// const server = http.createServer(app);
// const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
//   cors: { origin: '*', methods: ['GET', 'POST'] },
// });
// // --- 3. ИГРОВОЕ СОСТОЯНИЕ ---
// // Карта для хранения данных игроков (курсоров)
// let users = new Map<string, UserData>();
// // Карта для связи ID физического тела Matter.js с нашим игровым ID шарика
// let matterBodyIdToBallId = new Map<number, string>();
// // Карта для хранения игровых данных шарика (цвет, статус), не связанных с физикой
// let ballDataStore = new Map<string, { color: string; status: string }>();
// // --- 4. СОЗДАНИЕ ГРАНИЦ МИРА ---
// // Создаем 4 статичных прямоугольника (стены)
// const wallOptions = { isStatic: true, restitution: 1.0, friction: 0 };
// World.add(engine.world, [
//   // пол (снизу)
//   Bodies.rectangle(C.WIDTH / 2, C.HEIGHT + 25, C.WIDTH, 50, wallOptions),
//   // потолок (сверху)
//   Bodies.rectangle(C.WIDTH / 2, -25, C.WIDTH, 50, wallOptions),
//   // левая стена
//   Bodies.rectangle(-25, C.HEIGHT / 2, 50, C.HEIGHT, wallOptions),
//   // правая стена
//   Bodies.rectangle(C.WIDTH + 25, C.HEIGHT / 2, 50, C.HEIGHT, wallOptions),
// ]);
// /**
//  * Инициализирует игровую сессию: очищает старые данные и создает новые шарики.
//  */
// function initializeGame(settings: GameSettings): void {
//   // Удаляем из мира все предыдущие шарики (тела, которые не являются статичными)
//   const allBalls = engine.world.bodies.filter((body) => !body.isStatic);
//   World.remove(engine.world, allBalls);
//   // Очищаем наши карты для хранения данных
//   matterBodyIdToBallId.clear();
//   ballDataStore.clear();
//   const { quantity, numOfColors } = settings;
//   const activeColorKeys = C.COLOR_KEYS.slice(0, numOfColors);
//   const bodiesToAdd: Matter.Body[] = [];
//   for (let i = 0; i < quantity; i++) {
//     const randomColorKey =
//       activeColorKeys[Math.floor(Math.random() * activeColorKeys.length)];
//     const ballId = i.toString();
//     // Создаем физическое тело Matter.js с параметрами из наших констант
//     const body = Bodies.circle(
//       Math.random() * C.WIDTH,
//       Math.random() * C.HEIGHT,
//       C.BALL_RADIUS,
//       {
//         restitution: C.RESTITUTION,
//         friction: C.FRICTION,
//         frictionAir: C.FRICTION_AIR,
//         frictionStatic: C.FRICTION_STATIC,
//         density: C.DENSITY,
//       },
//     );
//     // Сохраняем связи и игровые данные
//     matterBodyIdToBallId.set(body.id, ballId);
//     ballDataStore.set(ballId, { color: randomColorKey, status: 'NONE' });
//     bodiesToAdd.push(body);
//   }
//   World.add(engine.world, bodiesToAdd);
//   console.log(`🚀 Игра инициализирована с ${quantity} шариками.`);
// }
// /**
//  * Главный игровой цикл, выполняется на каждом тике сервера.
//  */
// function gameLoop(): void {
//   const allBalls = engine.world.bodies.filter((body) => !body.isStatic);
//   // --- ЭТАП 1: Применяем наши кастомные силы (один раз за кадр) ---
//   for (const body of allBalls) {
//     // Сила от курсора
//     for (const user of users.values()) {
//       if (user.cursor) {
//         const distVector = Vector.sub(body.position, user.cursor);
//         const distance = Vector.magnitude(distVector);
//         if (distance < C.CURSOR_REPULSE_RADIUS && distance > 0) {
//           const strength =
//             C.CURSOR_REPULSE_STRENGTH *
//             (1 - distance / C.CURSOR_REPULSE_RADIUS);
//           const force = Vector.mult(Vector.normalise(distVector), strength);
//           Body.applyForce(body, body.position, force);
//         }
//       }
//     }
//   }
//   // Магнетизм
//   for (let i = 0; i < allBalls.length; i++) {
//     for (let j = i + 1; j < allBalls.length; j++) {
//       const b1 = allBalls[i];
//       const b2 = allBalls[j];
//       const data1 = ballDataStore.get(matterBodyIdToBallId.get(b1.id)!);
//       const data2 = ballDataStore.get(matterBodyIdToBallId.get(b2.id)!);
//       if (data1 && data2 && data1.color === data2.color) {
//         const distVector = Vector.sub(b1.position, b2.position);
//         const distance = Vector.magnitude(distVector);
//         const magnetRadius = C.BALL_RADIUS * C.MAGNET_RADIUS_MULTIPLIER;
//         if (distance < magnetRadius && distance > C.BALL_RADIUS * 2) {
//           const strength =
//             (1 -
//               (distance - C.BALL_RADIUS * 2) /
//                 (magnetRadius - C.BALL_RADIUS * 2)) *
//             C.MAGNET_STRENGTH;
//           const force = Vector.mult(Vector.normalise(distVector), -strength);
//           Body.applyForce(b1, b1.position, force);
//           Body.applyForce(b2, b2.position, Vector.neg(force));
//         }
//       }
//     }
//   }
//   // --- ❗️❗️❗️ ИСПРАВЛЕНИЕ ЗДЕСЬ: Цикл физических под-шагов ❗️❗️❗️ ---
//   // Мы делим один большой шаг времени (16.67 мс) на несколько маленьких.
//   const timeStep = 1000 / 60;
//   const subSteps = C.PHYSICS_SUB_STEPS;
//   for (let i = 0; i < subSteps; i++) {
//     // Движок делает один маленький шаг симуляции
//     Engine.update(engine, timeStep / subSteps);
//   }
//   // --- ЭТАП 3: Собираем результат и отправляем клиентам (один раз за кадр) ---
//   const ballsState: Record<string, BallStateClient> = {};
//   for (const body of allBalls) {
//     const ballId = matterBodyIdToBallId.get(body.id);
//     const data = ballDataStore.get(ballId!);
//     if (ballId && data) {
//       ballsState[ballId] = {
//         id: ballId,
//         x: body.position.x,
//         y: body.position.y,
//         radius: C.BALL_RADIUS,
//         color: data.color,
//         status: data.status,
//       };
//     }
//   }
//   const usersState = Array.from(users.values()).reduce(
//     (acc, user) => {
//       acc[user.id] = user;
//       return acc;
//     },
//     {} as Record<string, UserData>,
//   );
//   io.emit('game_state_update', { balls: ballsState, users: usersState });
// }
// // --- 5. ОБРАБОТКА WEBSOCKET-СОБЫТИЙ ---
// io.on('connection', (socket) => {
//   console.log(`🔌 Пользователь подключился: ${socket.id}`);
//   users.set(socket.id, { id: socket.id, cursor: null });
//   const ballsState: Record<string, BallStateClient> = {};
//   for (const body of engine.world.bodies.filter((body) => !body.isStatic)) {
//     const ballId = matterBodyIdToBallId.get(body.id);
//     const data = ballDataStore.get(ballId!);
//     if (ballId && data) {
//       ballsState[ballId] = {
//         id: ballId,
//         x: body.position.x,
//         y: body.position.y,
//         radius: C.BALL_RADIUS,
//         color: data.color,
//         status: data.status,
//       };
//     }
//   }
//   const usersState = Array.from(users.values()).reduce(
//     (acc, user) => {
//       acc[user.id] = user;
//       return acc;
//     },
//     {} as Record<string, UserData>,
//   );
//   socket.emit('game_state_update', { balls: ballsState, users: usersState });
//   socket.on('start_game', (settings) => {
//     initializeGame(settings);
//   });
//   socket.on('cursor_move', (position) => {
//     const user = users.get(socket.id);
//     if (user) {
//       user.cursor = position;
//     }
//   });
//   socket.on('disconnect', () => {
//     console.log(`🔌 Пользователь отключился: ${socket.id}`);
//     users.delete(socket.id);
//   });
// });
// // --- 6. ЗАПУСК СЕРВЕРА ---
// server.listen(PORT, () => {
//   console.log(`✅ Сервер запущен и слушает порт: ${PORT}`);
//   setInterval(gameLoop, 1000 / 60);
// });
