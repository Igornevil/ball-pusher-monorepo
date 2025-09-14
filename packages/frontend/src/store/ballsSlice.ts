import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  GAME_STATUS,
  type BallColorType,
  type BallStatusType,
  type GameStatusType,
} from '../game/ballPusher/constants';
import { STATUS, type StatusType } from '../constant/STATUS.js';

export interface BallState {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: BallColorType;
  status: BallStatusType;
}

export interface UserState {
  id: string;
  name: string;
  cursorColor: string;
  cursor?: { x: number; y: number } | null;
}

export interface SettingState {
  colorGroups: number;
  ballsPerGroup: number;
}
export interface ErrorState {
  id: string;
  message: string;
}
interface RoomState {
  id: string | null;
  status: StatusType;
  users: Record<string, UserState>;
  gameStatus: GameStatusType;
  balls: Record<string, BallState>;
  gameStartTime: number | null;
  gameDuration: number | null;
}
interface BallsSliceState {
  setting: SettingState;
  socketId: string | null;
  room: RoomState;
  errors: ErrorState[];
}

const initialState: BallsSliceState = {
  setting: { colorGroups: 4, ballsPerGroup: 5 },
  socketId: null,
  room: {
    id: null,
    status: STATUS.IDLE,
    users: {},
    gameStatus: GAME_STATUS.PREPARATION,
    balls: {},
    gameStartTime: null,
    gameDuration: null,
  },
  errors: [],
};

export type GameStatePayload = {
  balls?: Record<string, BallState>;
  users?: Record<string, UserState>;
  gameStatus?: GameStatusType;
  gameStartTime?: number | null;
  gameDuration?: number | null;
};

export const ballsSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updateGameState(state, action: PayloadAction<GameStatePayload>) {
      if (action.payload.balls) state.room.balls = action.payload.balls;
      if (action.payload.users) state.room.users = action.payload.users;
      if (action.payload.gameStatus)
        state.room.gameStatus = action.payload.gameStatus;
      if (action.payload.gameStartTime !== undefined)
        state.room.gameStartTime = action.payload.gameStartTime;
      if (action.payload.gameDuration !== undefined)
        state.room.gameDuration = action.payload.gameDuration;
    },
    setPath(state, action: PayloadAction<{ path: string[]; value: any }>) {
      const { path, value } = action.payload;
      if (!Array.isArray(path) || path.length === 0) return;
      let target: any = state;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (typeof target[key] !== 'object' || target[key] === null) {
          target[key] = {};
        }
        target = target[key];
      }
      target[path[path.length - 1]] = value;
    },
    setGameStatus(state, action: PayloadAction<GameStatusType>) {
      state.room.gameStatus = action.payload;
    },
    setSocketId(state, action: PayloadAction<string | null>) {
      state.socketId = action.payload;
    },
    roomConnectionAttempt(state) {
      state.room = { ...initialState.room, status: STATUS.CONNECTING };
    },
    roomConnectionSuccess(state, action: PayloadAction<{ roomId: string }>) {
      state.room.status = STATUS.CONNECTED;
      state.room.id = action.payload.roomId;
      state.room.gameStatus = GAME_STATUS.READY;
    },
    roomConnectionFailure(state, action: PayloadAction<{ error: string }>) {
      state.room = { ...initialState.room, status: STATUS.ERROR };
      state.errors.push({
        id: `err_${new Date().getTime()}`,
        message: action.payload.error,
      });
    },
    leaveRoom(state) {
      state.room = initialState.room;
    },
    removeError(state, action: PayloadAction<{ id: string }>) {
      state.errors = state.errors.filter((e) => e.id !== action.payload.id);
    },
  },
});

export const {
  updateGameState,
  setPath,
  setGameStatus,
  setSocketId,
  roomConnectionAttempt,
  roomConnectionSuccess,
  roomConnectionFailure,
  leaveRoom,
  removeError,
} = ballsSlice.actions;

export default ballsSlice.reducer;
