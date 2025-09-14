import Matter from 'matter-js';
import type { IGameRoom, GameSettings } from './types.js';
import {
  SERVER_WORLD_WIDTH as WIDTH,
  SERVER_WORLD_HEIGHT as HEIGHT,
  WALL_WIDTH,
  BALL_RADIUS,
  RESTITUTION,
  FRICTION,
  FRICTION_AIR,
  FRICTION_STATIC,
  DENSITY,
  COLOR_KEYS,
  BALL_STATUS,
} from './constants.js';

const { World, Bodies } = Matter;

export function initializeGame(room: IGameRoom, settings: GameSettings): void {
  try {
    const { ballsPerGroup, colorGroups } = settings;

    World.clear(room.engine.world, false);
    room.balls.clear();
    room.matterBodyIdToBallId.clear();
    room.ballDataStore.clear();

    // --- Створюємо стіни КОЖЕН РАЗ ---
    createWalls(room.engine.world);

    // Створюємо нові кульки
    const activeColorKeys = COLOR_KEYS.slice(0, colorGroups);
    const bodiesToAdd: Matter.Body[] = [];
    let ballIdCounter = 0;

    for (const colorName of activeColorKeys) {
      for (let i = 0; i < ballsPerGroup; i++) {
        const ballId = (ballIdCounter++).toString();
        const body = Bodies.circle(
          WIDTH * 0.2 + Math.random() * WIDTH * 0.6,
          HEIGHT * 0.2 + Math.random() * HEIGHT * 0.6,
          BALL_RADIUS,
          {
            restitution: RESTITUTION,
            friction: FRICTION,
            frictionAir: FRICTION_AIR,
            frictionStatic: FRICTION_STATIC,
            density: DENSITY,
          },
        );

        room.matterBodyIdToBallId.set(body.id, ballId);
        room.ballDataStore.set(ballId, {
          color: colorName,
          status: BALL_STATUS.NONE,
          originalColor: colorName,
        });
        room.balls.set(ballId, body);
        bodiesToAdd.push(body);
      }
    }

    World.add(room.engine.world, bodiesToAdd);
  } catch (error) {
    console.error('❌ Помилка ініціалізації гри:', error);
  }
}

function createWalls(world: Matter.World): void {
  const walls = [
    Bodies.rectangle(
      WIDTH / 2,
      -WALL_WIDTH / 2,
      WIDTH + WALL_WIDTH * 2,
      WALL_WIDTH,
      { isStatic: true, label: 'wall' },
    ),
    Bodies.rectangle(
      WIDTH / 2,
      HEIGHT + WALL_WIDTH / 2,
      WIDTH + WALL_WIDTH * 2,
      WALL_WIDTH,
      { isStatic: true, label: 'wall' },
    ),
    Bodies.rectangle(
      -WALL_WIDTH / 2,
      HEIGHT / 2,
      WALL_WIDTH,
      HEIGHT + WALL_WIDTH * 2,
      { isStatic: true, label: 'wall' },
    ),
    Bodies.rectangle(
      WIDTH + WALL_WIDTH / 2,
      HEIGHT / 2,
      WALL_WIDTH,
      HEIGHT + WALL_WIDTH * 2,
      { isStatic: true, label: 'wall' },
    ),
  ];
  World.add(world, walls);
}
