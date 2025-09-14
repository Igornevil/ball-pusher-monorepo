import { useEffect, useRef } from 'react';
import { Application, Graphics } from 'pixi.js';
import { useDispatch } from 'react-redux';
import { Ball } from './models/Ball.js';
import { useAppSelector } from '../../store/hooks.js';
import {
  updateGameState,
  type GameStatePayload,
} from '../../store/ballsSlice.js';
import { socket } from '../../services/index.js';
import {
  GAME_ASPECT_RATIO,
  SERVER_WORLD_HEIGHT,
  SERVER_WORLD_WIDTH,
} from './constants/world.js';
import { BALL_COLORS, type BallColorType } from './constants/index.js';
import s from './canvas.module.scss';

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const ballsMapRef = useRef<Map<string, Ball>>(new Map());
  const cursorsMapRef = useRef<Map<string, Graphics>>(new Map());

  const dispatch = useDispatch();

  const { room, socketId } = useAppSelector((state) => state.game);
  const { balls, users } = room;

  // --- Основний ефект ініціалізації ---
  useEffect(() => {
    if (!containerRef.current || appRef.current) return;
    const container = containerRef.current;

    const app = new Application({ backgroundColor: 0x1099bb, antialias: true });
    appRef.current = app;
    container.appendChild(app.view as HTMLCanvasElement);

    const ownCursor = new Graphics()
      .beginFill(0xffffff, 0.5)
      .drawCircle(0, 0, 30)
      .endFill();
    ownCursor.visible = false;
    app.stage.addChild(ownCursor);

    const handleResize = () => {
      const parent = container;
      const parentWidth = parent.clientWidth;
      const parentHeight = parent.clientHeight;
      const parentRatio = parentWidth / parentHeight;
      let newWidth: number;
      let newHeight: number;
      if (parentRatio > GAME_ASPECT_RATIO) {
        newHeight = parentHeight;
        newWidth = newHeight * GAME_ASPECT_RATIO;
      } else {
        newWidth = parentWidth;
        newHeight = newWidth / GAME_ASPECT_RATIO;
      }
      app.renderer.resize(newWidth, newHeight);
      const currentScale = newWidth / SERVER_WORLD_WIDTH;
      ownCursor.scale.set(currentScale);
      ballsMapRef.current.forEach((ball) =>
        ball.graphics.scale.set(currentScale),
      );
      cursorsMapRef.current.forEach((cursor) => cursor.scale.set(currentScale));

      const canvas = app.view as HTMLCanvasElement;
      canvas.style.left = `${(parentWidth - newWidth) / 2}px`;
      canvas.style.top = `${(parentHeight - newHeight) / 2}px`;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    let scaledPosition: { x: number; y: number } | null = null;
    const updatePosition = (clientX: number, clientY: number) => {
      const canvas = app.view as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const rawX = clientX - rect.left;
      const rawY = clientY - rect.top;
      ownCursor.x = rawX;
      ownCursor.y = rawY;
      const proportionalX = rawX / canvas.width;
      const proportionalY = rawY / canvas.height;
      scaledPosition = {
        x: proportionalX * SERVER_WORLD_WIDTH,
        y: proportionalY * SERVER_WORLD_HEIGHT,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      ownCursor.visible = true;
      updatePosition(e.clientX, e.clientY);
    };
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      ownCursor.visible = true;
      const touch = e.touches[0];
      if (touch) updatePosition(touch.clientX, touch.clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) updatePosition(touch.clientX, touch.clientY);
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      ownCursor.visible = false;
      scaledPosition = null;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    container.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    container.addEventListener('touchcancel', handleTouchEnd, {
      passive: false,
    });

    const intervalId = setInterval(() => {
      socket.emit('cursor_move', scaledPosition);
    }, 50);

    app.ticker.add(() => {
      const interpolationFactor = 0.15;
      ballsMapRef.current.forEach((ball) => {
        ball.graphics.x +=
          (ball.targetX - ball.graphics.x) * interpolationFactor;
        ball.graphics.y +=
          (ball.targetY - ball.graphics.y) * interpolationFactor;
      });
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
      clearInterval(intervalId);
      app.destroy(true, { children: true, texture: true, baseTexture: true });
      appRef.current = null;
    };
  }, []);

  // Ефекти синхронізації
  useEffect(() => {
    const onGameStateUpdate = (payload: GameStatePayload) =>
      dispatch(updateGameState(payload));
    socket.on('game_state_update', onGameStateUpdate);
    return () => {
      socket.off('game_state_update', onGameStateUpdate);
    };
  }, [dispatch]);

  useEffect(() => {
    const app = appRef.current;
    if (!app || !balls) return;
    const clientWidth = app.renderer.width;
    const clientHeight = app.renderer.height;
    const scale = clientWidth / SERVER_WORLD_WIDTH;
    const serverBallIds = new Set(Object.keys(balls));
    const localBallIds = new Set(ballsMapRef.current.keys());
    serverBallIds.forEach((id) => {
      const serverBall = balls[id];
      let localBall = ballsMapRef.current.get(id);
      const displayX = (serverBall.x / SERVER_WORLD_WIDTH) * clientWidth;
      const displayY = (serverBall.y / SERVER_WORLD_HEIGHT) * clientHeight;
      if (localBall) {
        localBall.targetX = displayX;
        localBall.targetY = displayY;
        const newColor = BALL_COLORS[serverBall.color as BallColorType];
        if (
          localBall.color !== newColor ||
          localBall.status !== serverBall.status
        ) {
          localBall.color = newColor;
          localBall.status = serverBall.status;
          localBall.updateVisuals();
        }
      } else {
        const newBall = new Ball({
          ...serverBall,
          radius: serverBall.radius,
          x: displayX,
          y: displayY,
          color:
            BALL_COLORS[serverBall.color as keyof typeof BALL_COLORS] ??
            0xffffff,
        });
        newBall.graphics.scale.set(scale);
        ballsMapRef.current.set(id, newBall);
        app.stage.addChild(newBall.graphics);
      }
    });
    localBallIds.forEach((id) => {
      if (!serverBallIds.has(id)) {
        const ballToRemove = ballsMapRef.current.get(id);
        if (ballToRemove) {
          ballToRemove.graphics.destroy();
          ballsMapRef.current.delete(id);
        }
      }
    });
  }, [balls]);

  useEffect(() => {
    const app = appRef.current;
    if (!app || !users || !socketId) return;
    const clientWidth = app.renderer.width;
    const clientHeight = app.renderer.height;
    const scale = clientWidth / SERVER_WORLD_WIDTH;
    const serverUserIds = new Set(Object.keys(users));
    const localCursorIds = new Set(cursorsMapRef.current.keys());
    serverUserIds.forEach((id) => {
      if (id === socketId) return;
      const user = users[id];
      if (!user.cursor) {
        const cursorToRemove = cursorsMapRef.current.get(id);
        if (cursorToRemove) {
          cursorToRemove.destroy();
          cursorsMapRef.current.delete(id);
        }
        return;
      }
      const displayX = (user.cursor.x / SERVER_WORLD_WIDTH) * clientWidth;
      const displayY = (user.cursor.y / SERVER_WORLD_HEIGHT) * clientHeight;
      let cursorGraphic = cursorsMapRef.current.get(id);
      if (cursorGraphic) {
        cursorGraphic.x = displayX;
        cursorGraphic.y = displayY;
      } else {
        const color = parseInt(user.cursorColor.slice(1), 16);
        cursorGraphic = new Graphics()
          .beginFill(color, 0.4)
          .drawCircle(0, 0, 30)
          .endFill();
        cursorGraphic.scale.set(scale);
        cursorGraphic.x = displayX;
        cursorGraphic.y = displayY;
        app.stage.addChild(cursorGraphic);
        cursorsMapRef.current.set(id, cursorGraphic);
      }
    });
    localCursorIds.forEach((id) => {
      if (!serverUserIds.has(id)) {
        const cursorToRemove = cursorsMapRef.current.get(id);
        if (cursorToRemove) {
          cursorToRemove.destroy();
          cursorsMapRef.current.delete(id);
        }
      }
    });
  }, [users, socketId]);

  return <div ref={containerRef} className={s.canvasContainer} />;
}
