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

export type BallColorType = keyof typeof BALL_COLORS;
