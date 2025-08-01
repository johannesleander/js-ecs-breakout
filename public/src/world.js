import { Ball, Brick, Paddle, Position, Renderable, Velocity } from './components.js';
import { MovementSystem } from './systems/movement-system.js';
import { BallCollisionSystem } from './systems/ball-collision-system.js';

export const world = new ApeECS.World();

// Components
world.registerComponent(Position);
world.registerComponent(Velocity);
world.registerComponent(Renderable);
world.registerComponent(Paddle);
world.registerComponent(Ball);
world.registerComponent(Brick);

// Systems
world.registerSystem('game-loop', MovementSystem);
world.registerSystem('game-loop', BallCollisionSystem);
