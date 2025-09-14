export class SpatialHashGrid {
  cells;
  cellSize;
  constructor(cellSize) {
    this.cells = new Map();
    this.cellSize = cellSize;
  }
  getKey(x, y) {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX}:${cellY}`;
  }
  clear() {
    this.cells.clear();
  }
  insert(ball) {
    const key = this.getKey(ball.x, ball.y);
    if (!this.cells.has(key)) {
      this.cells.set(key, []);
    }
    this.cells.get(key).push(ball);
  }
  query(ball) {
    const potentialNeighbors = [];
    const radius = ball.radius;
    const cellSize = this.cellSize;
    const startX = Math.floor((ball.x - radius) / cellSize);
    const startY = Math.floor((ball.y - radius) / cellSize);
    const endX = Math.floor((ball.x + radius) / cellSize);
    const endY = Math.floor((ball.y + radius) / cellSize);
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const key = `${x}:${y}`;
        if (this.cells.has(key)) {
          potentialNeighbors.push(...this.cells.get(key));
        }
      }
    }
    return potentialNeighbors;
  }
}
