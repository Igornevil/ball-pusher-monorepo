import type Matter from 'matter-js';
import type { Server } from 'socket.io';
import { BallColorName, BallStatusType } from './constants.js';

export interface GameSettings {
  colorGroups: number;
  ballsPerGroup: number;
}

export interface User {
  id: string;
  name: string;
  cursorColor: string;
  cursor: { x: number; y: number } | null;
}

export interface BallData {
  color: BallColorName;
  status: BallStatusType;
  originalColor: BallColorName;
}

export interface IGameRoom {
  id: string;
  users: Map<string, User>;
  status: 'waiting' | 'ready' | 'live' | 'finished';
  settings: GameSettings;
  engine: Matter.Engine;
  wallsCreated: boolean;
  matterBodyIdToBallId: Map<number, string>;
  ballDataStore: Map<string, BallData>;
  io?: Server;
  balls: Map<string, Matter.Body>;
  gameStartTime: number | null;
  gameDuration: number | null;
  addUser(userId: string, user: User): void;
  removeUser(userId: string): void;
  startGame(): void;
  stopGame(): void;
  cleanup(): void;
  getGameStateForClient(): {
    balls: Record<string, any>;
    users: Record<string, User>;
    gameStatus: string;
    gameStartTime: number | null;
    gameDuration: number | null;
  };
}
