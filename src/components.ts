import ECS from "ape-ecs";

export class Position extends ECS.Component { };
Position.properties = {
  x: 0,
  y: 0
}

export class Velocity extends ECS.Component { };
Velocity.properties = {
  dx: 0,
  dy: 0
}

export class Renderable extends ECS.Component { };
Renderable.properties = {
  width: 0,
  height: 0,
  color: "#fff"
}

export class PaddleControl extends ECS.Component { };
export class Ball extends ECS.Component { };
export class Brick extends ECS.Component { };
