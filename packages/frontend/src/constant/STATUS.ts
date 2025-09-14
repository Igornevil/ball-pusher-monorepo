export const STATUS = {
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
  ERROR: 'error',
  IDLE: 'idle',
} as const;

export type StatusType = (typeof STATUS)[keyof typeof STATUS];
