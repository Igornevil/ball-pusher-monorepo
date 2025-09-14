// import Matter, { World, Bodies, Body } from 'matter-js';
import Matter from 'matter-js';
import C from '../constants.js';
const { World, Bodies } = Matter;
/**
 * Инициализация новой игровой сессии:
 * - очищает старые шарики из физического мира,
 * - сбрасывает внутренние карты данных шариков,
 * - создаёт новые шарики с физикой и цветами.
 */
export function initializeGame(room, settings) {
  if (!room || !room.engine) {
    console.warn('❌ Room или engine не определены');
    return;
  }
  // --- 1. Удаляем все динамические тела (шары), оставляя стены ---
  const dynamicBodies = room.engine.world.bodies.filter(
    (body) => !body.isStatic,
  );
  if (dynamicBodies.length > 0) {
    World.remove(room.engine.world, dynamicBodies);
  }
  // --- 2. Сбрасываем внутренние карты ---
  room.matterBodyIdToBallId.clear();
  room.ballDataStore.clear();
  // --- 3. Подготовка данных для новой игры ---
  const { quantity, numOfColors } = settings;
  const activeColorKeys = C.COLOR_KEYS.slice(0, numOfColors);
  const bodiesToAdd = [];
  // --- 4. Создание новых шариков ---
  for (let i = 0; i < quantity; i++) {
    const color =
      activeColorKeys[Math.floor(Math.random() * activeColorKeys.length)];
    const ballId = i.toString();
    const body = Bodies.circle(
      Math.random() * C.WIDTH,
      Math.random() * C.HEIGHT,
      C.BALL_RADIUS,
      {
        restitution: C.RESTITUTION,
        friction: C.FRICTION,
        frictionAir: C.FRICTION_AIR,
        frictionStatic: C.FRICTION_STATIC,
        density: C.DENSITY,
      },
    );
    // Сохраняем связь между Matter.Body и логическим шариком
    room.matterBodyIdToBallId.set(body.id, ballId);
    room.ballDataStore.set(ballId, { color, status: 'NONE' });
    bodiesToAdd.push(body);
  }
  // --- 5. Добавляем все новые тела в физический мир ---
  if (bodiesToAdd.length > 0) {
    World.add(room.engine.world, bodiesToAdd);
  }
  console.log(
    `🚀 Игра в комнате ${room.id} инициализирована с ${quantity} шарами`,
  );
}
