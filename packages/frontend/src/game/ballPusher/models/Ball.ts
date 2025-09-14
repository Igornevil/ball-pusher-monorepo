import { Graphics, Sprite } from 'pixi.js';
import { BALL_STATUS } from '../constants';

export class Ball {
  id: string;
  radius: number;
  color: number;
  status: string;

  graphics: Graphics;
  sprite?: Sprite;

  targetX: number;
  targetY: number;

  constructor({
    x,
    y,
    radius,
    color,
    status,
    id,
  }: {
    x: number;
    y: number;
    radius: number;
    color: number;
    status?: string;
    id: string;
  }) {
    this.id = id;
    this.radius = radius;
    this.color = color;
    this.status = status ?? BALL_STATUS.NONE;

    // Инициализируем целевые координаты стартовыми значениями
    this.targetX = x;
    this.targetY = y;

    // Создаем графический объект
    this.graphics = new Graphics();
    this.updateVisuals();

    // Устанавливаем начальную позицию графики
    this.graphics.x = x;
    this.graphics.y = y;
  }

  /**
   * Обновляет внешний вид шарика на основе его текущего состояния.
   */
  public updateVisuals() {
    this.graphics.clear();
    this.graphics.beginFill(this.color);

    if (this.status === BALL_STATUS.ACTIVE) {
      this.graphics.lineStyle(this.radius * 0.1, 0xffffff, 1);
    }

    this.graphics.drawCircle(0, 0, this.radius);
    this.graphics.endFill();
  }
}
