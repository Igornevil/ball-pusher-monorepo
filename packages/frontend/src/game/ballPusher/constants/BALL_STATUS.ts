export const BALL_STATUS = {
  NONE: 'none',
  LINKED: 'linked',
  ACTIVE: 'active',
} as const;

export type BallStatusType = (typeof BALL_STATUS)[keyof typeof BALL_STATUS];
