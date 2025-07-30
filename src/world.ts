import * as ECS from 'ape-ecs'
import { Ball, Brick, PaddleControl, Position, Renderable, Velocity } from './components';
import { MovementSystem } from './systems/movement-system';

export const world = new ECS.World();

world.registerComponent(Position);
world.registerComponent(Velocity);
world.registerComponent(Renderable);
world.registerComponent(PaddleControl);
world.registerComponent(Ball);
world.registerComponent(Brick);

world.registerSystem('movement', MovementSystem);
