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

export class PreviousPositions extends ApeECS.Component { };

/**
 * @typedef {Object} PreviousPositionsProps
 * @property {Position[]} prev
 * @property {number} maxLength
 */

/** @type {PreviousPositionsProps} */
PreviousPositions.properties = {
  prev: [],
  maxLength: 1,
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

export class BounceCount extends ApeECS.Component { };

/**
 * @typedef {Object} BounceCountProps
 * @property {number} value
 */

/** @type {BounceCountProps} */
BounceCount.properties = {
  value: 0,
}

export class Collider extends ApeECS.Component { };

/**
 * @typedef {Object} ColliderProps
 * @property {number} width
 * @property {number} height
 */

/** @type {ColliderProps} */
Collider.properties = {
  width: 0,
  height: 0
}

export class FrameInfo extends ApeECS.Component { };

/**
 * @typedef {Object} FrameInfoProps
 * @property {number} deltaTime
 * @property {number} lastUpdate
 */

/** @type {FrameInfoProps} */
FrameInfo.properties = {
  deltaTime: 0,
  lastUpdate: 0
}

export class Paddle extends ApeECS.Component { };
export class Ball extends ApeECS.Component { };
export class Brick extends ApeECS.Component { };
export class Wall extends ApeECS.Component { };
export class Pit extends ApeECS.Component { };
