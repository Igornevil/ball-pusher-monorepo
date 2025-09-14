// --- Розміри ігрового світу ---
export const SERVER_WORLD_WIDTH = 1280;
export const SERVER_WORLD_HEIGHT = 720;
export const BALL_RADIUS = 15;
export const WALL_WIDTH = 50;

// --- Фізика Matter.js ---
export const FRICTION_AIR = 0.06;
export const FRICTION = 0.1;
export const FRICTION_STATIC = 0.9;
export const RESTITUTION = 0.9;
export const DENSITY = 0.005;

// --- Налаштування сил ---
export const CURSOR_REPULSE_RADIUS = 150;
export const CURSOR_REPULSE_STRENGTH = 0.02;
export const MAGNET_RADIUS_MULTIPLIER = 6;
export const MAGNET_STRENGTH = 0.9;
export const NOISE_FORCE = 0.005;

/**
 * Множник для визначення відстані, на якій кульки вважаються згрупованими.
 * 2.1 означає (діаметр + невеликий запас на фізичні коливання).
 */
export const GROUPING_DISTANCE_MULTIPLIER = 2.1;

export const BALL_COLORS = {
  RED: 0xff0000,
  GREEN: 0x00ff00,
  BLUE: 0x0000ff,
  YELLOW: 0xffff00,
  MAGENTA: 0xff00ff,
  CYAN: 0x00ffff,
  WHITE: 0xffffff,
  GRAY: 0x888888,
  ORANGE: 0xff8800,
  SKY: 0x0088ff,
} as const;

export type BallColorName = keyof typeof BALL_COLORS;
export const COLOR_KEYS = Object.keys(BALL_COLORS) as BallColorName[];
export const PLAYER_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B'];

export type BallColorType = keyof typeof BALL_COLORS;

export const BALL_STATUS = {
  NONE: 'NONE',
  GROUPED: 'GROUPED',
  PERFECT: 'PERFECT',
} as const;

export type BallStatusType = keyof typeof BALL_STATUS;
