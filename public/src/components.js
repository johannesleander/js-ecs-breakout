export class Position extends ApeECS.Component { };

/**
 * @typedef {Object} PositionProps
 * @property {number} x
 * @property {number} y
 */

/** @type {PositionProps} */
Position.properties = {
  x: 0,
  y: 0,
};

export class Velocity extends ApeECS.Component { };
/**
 * @typedef {Object} VelocityProps
 * @property {number} dx
 * @property {number} dy
 */

/** @type {VelocityProps} */
Velocity.properties = {
  dx: 0,
  dy: 0
}

export class Renderable extends ApeECS.Component { };

/**
 * @typedef {Object} RenderableProps
 * @property {number} width
 * @property {number} height
 * @property {string} color
 */

/** @type {RenderableProps} */
Renderable.properties = {
  width: 0,
  height: 0,
  color: "#fff",
}

export class Paddle extends ApeECS.Component { };
export class Ball extends ApeECS.Component { };
export class Brick extends ApeECS.Component { };
