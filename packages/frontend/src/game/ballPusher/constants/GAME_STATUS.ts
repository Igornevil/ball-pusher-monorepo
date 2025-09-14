export const GAME_STATUS = {
  PREPARATION: 'preparation', // Гравець налаштовує гру, не в кімнаті
  READY: 'ready', // В лобі, очікування старту
  STARTING: 'starting', // Йде зворотний відлік до початку
  LIVE: 'live', // Активний ігровий процес
  PAUSED: 'paused', // Гра тимчасово зупинена
  FINISHED: 'finished', // Гру завершено, екран результатів
} as const;

export type GameStatusType = (typeof GAME_STATUS)[keyof typeof GAME_STATUS];
