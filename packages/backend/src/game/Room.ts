import Matter from 'matter-js';
import type { Server } from 'socket.io';
import type { GameSettings, User, BallData, IGameRoom } from './types.js';
import { initializeGame } from './initializeGame.js';
import { gameLoop } from './gameLoop.js';
import { BALL_RADIUS } from './constants.js';

const { Engine } = Matter;

export class Room implements IGameRoom {
  public id: string;
  public users: Map<string, User> = new Map();
  public status: 'waiting' | 'ready' | 'live' | 'finished' = 'waiting';
  public settings: GameSettings;
  public engine: Matter.Engine;
  public wallsCreated: boolean = false;
  public matterBodyIdToBallId: Map<number, string> = new Map();
  public ballDataStore: Map<string, BallData> = new Map();
  public io?: Server;
  private gameInterval: NodeJS.Timeout | null = null;
  public balls: Map<string, Matter.Body> = new Map();
  public gameStartTime: number | null = null;
  public gameDuration: number | null = null;
  private onFinished?: () => void;

  constructor(
    id: string,
    settings: GameSettings,
    io?: Server,
    onFinished?: () => void,
  ) {
    this.id = id;
    this.settings = settings;
    this.io = io;
    this.onFinished = onFinished;
    this.engine = Engine.create({ gravity: { x: 0, y: 0 } });
  }

  addUser(userId: string, user: User): void {
    this.users.set(userId, user);
  }

  removeUser(userId: string): void {
    this.users.delete(userId);
  }

  startGame(): void {
    if (this.status === 'waiting' || this.status === 'ready') {
      this.status = 'ready';
      initializeGame(this, this.settings);

      this.status = 'live';
      this.gameStartTime = Date.now();
      this.gameDuration = null;

      const stateToSend = this.getGameStateForClient();
      console.log(`[Room ${this.id}] Гра почалася. Надсилаємо стан:`);

      this.io?.to(this.id).emit('game_state_update', stateToSend);
      this.startGameLoop();
    }
  }

  private startGameLoop(): void {
    if (this.gameInterval) clearInterval(this.gameInterval);
    this.gameInterval = setInterval(() => {
      if (this.status === 'live') {
        gameLoop(this);
      } else {
        if (this.gameInterval) clearInterval(this.gameInterval);
      }
    }, 1000 / 30);
  }

  stopGame(): void {
    this.status = 'finished';

    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }

    if (this.onFinished) {
      setTimeout(() => {
        this.onFinished!();
        console.log(`[Room ${this.id}] Видалена`);
      }, 1000);
    }

    if (this.gameStartTime && !this.gameDuration) {
      this.gameDuration = Date.now() - this.gameStartTime;
      const seconds = (this.gameDuration / 1000).toFixed(3);
      console.log(
        `[Room ${this.id}] Гра завершена! Час проходження: ${seconds} секунд (${this.gameDuration} мс).`,
      );
    }

    this.status = 'finished';
    this.io
      ?.to(this.id)
      .emit('game_state_update', this.getGameStateForClient());
  }

  cleanup(): void {
    this.stopGame();
    Matter.Engine.clear(this.engine);
  }

  getGameStateForClient() {
    const ballsState: Record<string, any> = {};
    this.balls.forEach((body, ballId) => {
      const data = this.ballDataStore.get(ballId);
      if (data) {
        ballsState[ballId] = {
          id: ballId,
          x: body.position.x,
          y: body.position.y,
          radius: BALL_RADIUS,
          color: data.color,
          status: data.status,
        };
      }
    });
    const usersState = Object.fromEntries(this.users);
    return {
      balls: ballsState,
      users: usersState,
      gameStatus: this.status,
      gameStartTime: this.gameStartTime,
      gameDuration: this.gameDuration,
    };
  }
}
