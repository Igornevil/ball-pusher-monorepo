import Matter from 'matter-js';
import type { IGameRoom } from './types.js';
import {
  CURSOR_REPULSE_RADIUS,
  CURSOR_REPULSE_STRENGTH,
  NOISE_FORCE,
  BALL_RADIUS,
  MAGNET_RADIUS_MULTIPLIER,
  MAGNET_STRENGTH,
  GROUPING_DISTANCE_MULTIPLIER,
  BallColorName,
  BallStatusType,
  BALL_STATUS,
} from './constants.js';

const { Body, Vector, Engine } = Matter;

export function gameLoop(room: IGameRoom): void {
  if (!room.engine || room.status !== 'live') return;

  const allBalls = room.engine.world.bodies.filter((body) => !body.isStatic);
  if (allBalls.length === 0) {
    sendGameStateToClients(room);
    return;
  }

  // --- 1. Застосовуємо фізику ---
  applyPhysics(allBalls, room);

  // --- 2. Оновлюємо фізичний рушій ---
  Engine.update(room.engine, 1000 / 60);

  // --- 3. Аналізуємо стан поля та оновлюємо статуси кульок ---
  checkGroupingAndGameEnd(allBalls, room);

  // --- 4. Відправляємо фінальний стан клієнтам ---
  sendGameStateToClients(room);
}

// --- Функція для застосування фізики ---
function applyPhysics(allBalls: Matter.Body[], room: IGameRoom) {
  for (let i = 0; i < allBalls.length; i++) {
    const b1 = allBalls[i];

    // Хаотичний рух
    const noise = Vector.create(
      (Math.random() - 0.5) * NOISE_FORCE,
      (Math.random() - 0.5) * NOISE_FORCE,
    );
    Body.applyForce(b1, b1.position, noise);

    // Опір середовища
    Body.setVelocity(b1, { x: b1.velocity.x * 0.99, y: b1.velocity.y * 0.99 });

    // Взаємодія з курсорами гравців
    for (const user of room.users.values()) {
      if (user.cursor) {
        const distVector = Vector.sub(b1.position, user.cursor);
        const distance = Vector.magnitude(distVector);
        if (distance < CURSOR_REPULSE_RADIUS && distance > 0) {
          const strength =
            CURSOR_REPULSE_STRENGTH * (1 - distance / CURSOR_REPULSE_RADIUS);
          const force = Vector.mult(Vector.normalise(distVector), strength);
          Body.applyForce(b1, b1.position, force);
        }
      }
    }

    // Взаємодія між кульками
    for (let j = i + 1; j < allBalls.length; j++) {
      const b2 = allBalls[j];
      const data1 = room.ballDataStore.get(
        room.matterBodyIdToBallId.get(b1.id)!,
      );
      const data2 = room.ballDataStore.get(
        room.matterBodyIdToBallId.get(b2.id)!,
      );
      const distVector = Vector.sub(b2.position, b1.position);
      const distance = Vector.magnitude(distVector);

      if (distance > 0) {
        const normal = Vector.normalise(distVector);
        const minDist = BALL_RADIUS * 2;

        // Відштовхування при контакті
        if (distance < minDist) {
          const overlap = minDist - distance;
          const strength = overlap * 0.005;
          const force = Vector.mult(normal, -strength);
          Body.applyForce(b1, b1.position, force);
          Body.applyForce(b2, b2.position, Vector.neg(force));
        }

        // Прилипання однакових кольорів
        if (data1 && data2 && data1.color === data2.color) {
          const magnetRadius = BALL_RADIUS * MAGNET_RADIUS_MULTIPLIER;
          if (distance < magnetRadius && distance > minDist) {
            const strength =
              (1 - (distance - minDist) / (magnetRadius - minDist)) *
              MAGNET_STRENGTH;
            const force = Vector.mult(normal, strength * 0.002);
            Body.applyForce(b1, b1.position, force);
            Body.applyForce(b2, b2.position, Vector.neg(force));
          }
        }
      }
    }
  }
}

// --- Логіка аналізу стану гри (без змін) ---
function checkGroupingAndGameEnd(allBalls: Matter.Body[], room: IGameRoom) {
  const ballsByColor = new Map<BallColorName, Matter.Body[]>();
  for (const ball of allBalls) {
    const ballId = room.matterBodyIdToBallId.get(ball.id);
    const data = room.ballDataStore.get(ballId!);
    if (data) {
      if (!ballsByColor.has(data.color)) {
        ballsByColor.set(data.color, []);
      }
      ballsByColor.get(data.color)!.push(ball);
    }
  }

  let perfectGroupsCount = 0;
  const groupingDistance = BALL_RADIUS * GROUPING_DISTANCE_MULTIPLIER;

  for (const [, group] of ballsByColor.entries()) {
    const totalBallsOfThisColor = room.settings.ballsPerGroup;
    const largestCluster = findLargestCluster(group, groupingDistance);

    let status: BallStatusType = BALL_STATUS.NONE;
    if (
      largestCluster.size === totalBallsOfThisColor &&
      totalBallsOfThisColor > 1
    ) {
      status = 'PERFECT';
      perfectGroupsCount++;
    } else if (largestCluster.size > 1) {
      status = 'GROUPED';
    }

    for (const ball of group) {
      const ballId = room.matterBodyIdToBallId.get(ball.id)!;
      const data = room.ballDataStore.get(ballId)!;
      if (data.status !== status) {
        if (status === BALL_STATUS.GROUPED) {
          data.status = largestCluster.has(ball.id)
            ? BALL_STATUS.GROUPED
            : BALL_STATUS.NONE;
        } else {
          data.status = status;
        }
      }
    }
  }

  if (
    perfectGroupsCount === room.settings.colorGroups &&
    room.status === 'live'
  ) {
    console.log(
      `🏆 Гра в кімнаті ${room.id} завершена! Всі групи відсортовані.`,
    );
    room.stopGame();
  }
}

// --- Алгоритм пошуку зв'язаних груп ---
function findLargestCluster(
  balls: Matter.Body[],
  distanceThreshold: number,
): Set<number> {
  if (balls.length === 0) return new Set();
  let largestCluster = new Set<number>();
  const visited = new Set<number>();

  for (const startBall of balls) {
    if (visited.has(startBall.id)) continue;
    const currentCluster = new Set<number>();
    const queue = [startBall];
    visited.add(startBall.id);
    currentCluster.add(startBall.id);

    while (queue.length > 0) {
      const currentBall = queue.shift()!;
      for (const otherBall of balls) {
        if (visited.has(otherBall.id)) continue;
        const dist = Vector.magnitude(
          Vector.sub(currentBall.position, otherBall.position),
        );
        if (dist < distanceThreshold) {
          visited.add(otherBall.id);
          currentCluster.add(otherBall.id);
          queue.push(otherBall);
        }
      }
    }
    if (currentCluster.size > largestCluster.size) {
      largestCluster = currentCluster;
    }
  }
  return largestCluster;
}

function sendGameStateToClients(room: IGameRoom): void {
  if (!room.io) return;
  const gameState = room.getGameStateForClient();
  room.io.to(room.id).emit('game_state_update', gameState);
}
