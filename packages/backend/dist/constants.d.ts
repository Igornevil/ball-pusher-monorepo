declare const C: {
  WIDTH: number;
  HEIGHT: number;
  BALL_RADIUS: number;
  /** Опір "повітря". Зменшено, щоб шарики були більш "жвавими". */
  FRICTION_AIR: number;
  /** Тертя між тілами при зіткненні. */
  FRICTION: number;
  /** Коефіцієнт статичного тертя. */
  FRICTION_STATIC: number;
  /** Коефіцієнт пружності (відскоку). */
  RESTITUTION: number;
  /** Щільність тіла / маса. */
  DENSITY: number;
  CURSOR_REPULSE_RADIUS: number;
  /** Сила, з якою курсор відштовхує шарики. Значно збільшено. */
  CURSOR_REPULSE_STRENGTH: number;
  MAGNET_RADIUS_MULTIPLIER: number;
  /** Сила притягування. Збільшено для більш помітного ефекту. */
  MAGNET_STRENGTH: number;
  /** Кількість під-кроків фізики за один кадр. */
  PHYSICS_SUB_STEPS: number;
  NOISE_FORCE: number;
  COLOR_KEYS: string[];
};
export default C;
