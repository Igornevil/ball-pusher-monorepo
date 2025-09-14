import { Engine, Body, Vector } from 'matter-js';
import C from '../constants.js';
/**
 * Игровой цикл — обновляет физику и рассылает состояние клиентам.
 */
export function gameLoop(io, room) {
  const allBalls = room.engine.world.bodies.filter((b) => !b.isStatic);
  for (let i = 0; i < allBalls.length; i++) {
    const b1 = allBalls[i];
    // --- хаотичное движение ---
    const noise = Vector.create(
      (Math.random() - 0.5) * C.NOISE_FORCE,
      (Math.random() - 0.5) * C.NOISE_FORCE,
    );
    Body.applyForce(b1, b1.position, noise);
    // --- лёгкое сопротивление ---
    Body.setVelocity(b1, {
      x: b1.velocity.x * 0.99,
      y: b1.velocity.y * 0.99,
    });
    // --- взаимодействие с курсором ---
    for (const user of room.users.values()) {
      if (user.cursor) {
        const distVector = Vector.sub(b1.position, user.cursor);
        const distance = Vector.magnitude(distVector);
        if (distance < C.CURSOR_REPULSE_RADIUS && distance > 0) {
          const strength =
            C.CURSOR_REPULSE_STRENGTH *
            (1 - distance / C.CURSOR_REPULSE_RADIUS);
          const force = Vector.mult(Vector.normalise(distVector), strength);
          Body.applyForce(b1, b1.position, force);
        }
      }
    }
    // --- взаимодействие шариков между собой ---
    for (let j = i + 1; j < allBalls.length; j++) {
      const b2 = allBalls[j];
      const data1 = room.ballDataStore.get(
        room.matterBodyIdToBallId.get(b1.id),
      );
      const data2 = room.ballDataStore.get(
        room.matterBodyIdToBallId.get(b2.id),
      );
      const distVector = Vector.sub(b2.position, b1.position);
      const distance = Vector.magnitude(distVector);
      if (distance > 0) {
        const normal = Vector.normalise(distVector);
        // A. жёсткое отталкивание
        const minDist = C.BALL_RADIUS * 2;
        if (distance < minDist) {
          const overlap = minDist - distance;
          const strength = overlap * 0.005;
          const force = Vector.mult(normal, -strength);
          Body.applyForce(b1, b1.position, force);
          Body.applyForce(b2, b2.position, Vector.neg(force));
        }
        // B. прилипание по цветам
        if (data1 && data2 && data1.color === data2.color) {
          const magnetRadius = C.BALL_RADIUS * C.MAGNET_RADIUS_MULTIPLIER;
          if (distance < magnetRadius && distance > minDist) {
            const strength =
              (1 - (distance - minDist) / (magnetRadius - minDist)) *
              C.MAGNET_STRENGTH;
            const force = Vector.mult(normal, strength * 0.002);
            Body.applyForce(b1, b1.position, force);
            Body.applyForce(b2, b2.position, Vector.neg(force));
          }
        }
      }
    }
  }
  // --- шаги движка ---
  const timeStep = 1000 / 60;
  for (let i = 0; i < C.PHYSICS_SUB_STEPS; i++) {
    Engine.update(room.engine, timeStep / C.PHYSICS_SUB_STEPS);
  }
  // --- собираем состояние ---
  const ballsState = {};
  for (const body of allBalls) {
    const ballId = room.matterBodyIdToBallId.get(body.id);
    const data = room.ballDataStore.get(ballId);
    if (ballId && data) {
      ballsState[ballId] = {
        id: ballId,
        x: body.position.x,
        y: body.position.y,
        radius: C.BALL_RADIUS,
        color: data.color,
        status: data.status,
      };
    }
  }
  const usersState = Array.from(room.users.values()).reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});
  io.to(room.id).emit('game_state_update', {
    balls: ballsState,
    users: usersState,
  });
}
