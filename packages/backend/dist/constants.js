const C = {
  // --- Розміри ігрового світу ---
  WIDTH: 1280,
  HEIGHT: 720,
  BALL_RADIUS: 15,
  // --- Фізика Matter.js ---
  /** Опір "повітря". Зменшено, щоб шарики були більш "жвавими". */
  FRICTION_AIR: 0.03,
  /** Тертя між тілами при зіткненні. */
  FRICTION: 0.1,
  /** Коефіцієнт статичного тертя. */
  FRICTION_STATIC: 0.7,
  /** Коефіцієнт пружності (відскоку). */
  RESTITUTION: 0.9,
  /** Щільність тіла / маса. */
  DENSITY: 0.005,
  // --- Налаштування сил ---
  CURSOR_REPULSE_RADIUS: 150,
  /** Сила, з якою курсор відштовхує шарики. Значно збільшено. */
  CURSOR_REPULSE_STRENGTH: 0.03, // Было 0.005
  MAGNET_RADIUS_MULTIPLIER: 6,
  /** Сила притягування. Збільшено для більш помітного ефекту. */
  MAGNET_STRENGTH: 0.9, // Было 0.00005
  /** Кількість під-кроків фізики за один кадр. */
  PHYSICS_SUB_STEPS: 7,
  NOISE_FORCE: 0.005, // сила хаотичного движения
  // --- Ігрові налаштування ---
  COLOR_KEYS: [
    'RED',
    'GREEN',
    'BLUE',
    'YELLOW',
    'MAGENTA',
    'CYAN',
    'WHITE',
    'GRAY',
    'ORANGE',
    'SKY',
  ],
};
export default C;
