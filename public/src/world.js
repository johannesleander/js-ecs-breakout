import { Ball, BounceCount, Brick, Collider, FrameInfo, Paddle, Pit, Position, Renderable, Velocity, Wall } from './components.js';
import { PlayerControllerSystem } from './systems/player-controller-system.js';
// import { BallCollisionSystem } from './systems/ball-collision-system.js';
import { CollisionSystem } from './systems/collision-system.js';
import { FrameInfoSystem } from './systems/frame-info-system.js';
import { MovementSystem } from './systems/movement-system.js';
import { RenderSystem } from './systems/render-system.js';
import { WinSystem } from './systems/win-system.js';

export const world = new ApeECS.World();

// Components
world.registerComponent(FrameInfo)
world.registerComponent(Position);
world.registerComponent(Velocity);
world.registerComponent(BounceCount);
world.registerComponent(Renderable);
world.registerComponent(Collider);
world.registerComponent(Paddle);
world.registerComponent(Ball);
world.registerComponent(Brick);
world.registerComponent(Wall);
world.registerComponent(Pit)

// Systems
world.registerSystem('game-loop', PlayerControllerSystem);
world.registerSystem('game-loop', CollisionSystem)
world.registerSystem('game-loop', RenderSystem);
world.registerSystem('game-loop', MovementSystem)
world.registerSystem('game-loop', FrameInfoSystem)
world.registerSystem('game-loop', WinSystem)