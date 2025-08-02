import { Ball, Brick, Paddle, Position, BounceCount, Velocity, Renderable } from './components.js';
import { MovementSystem } from './systems/movement-system.js';
import { BallCollisionSystem } from './systems/ball-collision-system.js';
import { RenderSystem } from './systems/render-system.js';

export const world = new ApeECS.World();

// Components
world.registerComponent(Position);
world.registerComponent(Velocity);
world.registerComponent(BounceCount);
world.registerComponent(Paddle);
world.registerComponent(Ball);
world.registerComponent(Brick);
world.registerComponent(Renderable);

// Systems
world.registerSystem('game-loop', MovementSystem);
world.registerSystem('game-loop', BallCollisionSystem);
world.registerSystem('game-loop', RenderSystem);
