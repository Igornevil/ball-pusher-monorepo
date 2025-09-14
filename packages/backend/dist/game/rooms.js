import Matter from 'matter-js';
const { Engine } = Matter;
export class Room {
  id;
  engine;
  users;
  matterBodyIdToBallId;
  ballDataStore;
  constructor(id) {
    this.id = id;
    this.engine = Engine.create();
    this.engine.world.gravity.y = 0;
    this.users = new Map();
    this.matterBodyIdToBallId = new Map();
    this.ballDataStore = new Map();
  }
}
