export class Position extends ApeECS.Component { };
Position.properties = {
  x: 0,
  y: 0
}

export class Velocity extends ApeECS.Component { };
Velocity.properties = {
  dx: 0,
  dy: 0
}

export class Renderable extends ApeECS.Component { };
Renderable.properties = {
  width: 0,
  height: 0,
  color: "#fff"
}

export class PaddleControl extends ApeECS.Component { };
export class Ball extends ApeECS.Component { };
export class Brick extends ApeECS.Component { };
