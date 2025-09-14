/**
 * Описывает ПОЛНЫЕ данные, которые хранятся и обрабатываются на сервере.
 */
export interface BallData {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  status: string;
  vx: number;
  vy: number;
}
/**
 * --- НОВЫЙ ТИП ---
 * Описывает УРЕЗАННЫЕ данные о шарике, которые отправляются клиенту.
 * Это BallData, но без полей vx и vy.
 */
export type BallStateClient = Omit<BallData, 'vx' | 'vy'>;
/**
 * Описывает данные о пользователе.
 */
export interface UserData {
  id: string;
  cursor: {
    x: number;
    y: number;
  } | null;
}
/**
 * Описывает типы для настроек игры.
 */
export interface GameSettings {
  quantity: number;
  numOfColors: number;
}
/**
 * Типизация для событий, которые СЕРВЕР отправляет КЛИЕНТУ.
 */
export interface ServerToClientEvents {
  game_state_update: (payload: {
    balls: Record<string, BallStateClient>;
    users: Record<string, UserData>;
  }) => void;
}
/**
 * Типизация для событий, которые КЛИЕНТ отправляет на СЕРВЕР.
 */
export interface ClientToServerEvents {
  start_game: (settings: GameSettings) => void;
  cursor_move: (position: { x: number; y: number }) => void;
}
