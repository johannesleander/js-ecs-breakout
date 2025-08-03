// import { Ball, BounceCount, Brick, Collider, FrameInfo, Paddle, Pit, Position, Renderable, Velocity, Wall } from './components.js';
import * as components from './components.js';
import { CollisionSystem } from './systems/collision-system.js';
import { FrameInfoSystem } from './systems/frame-info-system.js';
import { LoseSystem } from './systems/lose-system.js';
import { MovementSystem } from './systems/movement-system.js';
import { PaddleControllerSystem } from './systems/paddle-controller-system.js';
import { RenderSystem } from './systems/render-system.js';
import { WinSystem } from './systems/win-system.js';

export const world = new ApeECS.World();

for (const c of Object.values(components)) {
    world.registerComponent(c)
}

// Systems
world.registerSystem('game-loop', PaddleControllerSystem);
world.registerSystem('game-loop', CollisionSystem)
world.registerSystem('game-loop', RenderSystem);
world.registerSystem('game-loop', MovementSystem)
world.registerSystem('game-loop', FrameInfoSystem)
world.registerSystem('win', WinSystem)
world.registerSystem('lose', LoseSystem)