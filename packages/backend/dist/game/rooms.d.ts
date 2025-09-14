import Matter from 'matter-js';
import type { UserData } from '../types.js';
export declare class Room {
  id: string;
  engine: Matter.Engine;
  users: Map<string, UserData>;
  matterBodyIdToBallId: Map<number, string>;
  ballDataStore: Map<
    string,
    {
      color: string;
      status: string;
    }
  >;
  constructor(id: string);
}
