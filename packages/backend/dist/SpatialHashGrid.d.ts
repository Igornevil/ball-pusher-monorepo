import type { BallData } from './types.js';
export declare class SpatialHashGrid {
  private cells;
  private cellSize;
  constructor(cellSize: number);
  private getKey;
  clear(): void;
  insert(ball: BallData): void;
  query(ball: BallData): BallData[];
}
