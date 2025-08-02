/// <reference path="../../types/ape-ecs-global.d.ts" />
import 'ape-ecs'
import { world } from './world.js';

export const getScreenHeight = () => 600
export const getScreenWidth = () => 800

/** 
 * @typedef {import("./components.js").PositionProps} PositionProps
 * @typedef {import("./components.js").VelocityProps} VelocityProps
 * @typedef {import("./components.js").RenderableProps} RenderableProps
 * @typedef {import("./components.js").BounceCountProps} BounceCountProps
 * @typedef {import("./components.js").ColliderProps} ColliderProps
 * @typedef {import("./components.js").FrameInfoProps} FrameInfoProps
 */

function createEntities() {
  // FrameInfo
  world.createEntity({
    id: 'Frame',
    c: {
      /** @type {FrameInfoProps} */
      "FrameInfo": { deltaTime: 0, lastUpdate: performance.now() }
    }
  })

  // Paddle
  world.createEntity({
    c: {
      /** @type {PositionProps} */
      "Position": { x: 350, y: 580 },
      /** @type {VelocityProps} */
      "Velocity": { dx: 0, dy: 0 },
      /** @type {RenderableProps} */
      "Renderable": { width: 100, height: 20, color: "hotpink" },
      /** @type {ColliderProps} */
      "Collider": { width: 100, height: 20 },
      "Paddle": {},
    },
  });

  // Ball
  world.createEntity({
    c: {
      /** @type {PositionProps} */
      "Position": {
        x: Math.max(Math.random() * 800, 1),
        y: 300,
      },
      /** @type {VelocityProps} */
      "Velocity": { dx: 120, dy: 120 },
      /** @type {RenderableProps} */
      "Renderable": { width: 10, height: 10, color: "red" },
      /** @type {ColliderProps} */
      "Collider": { width: 10, height: 10 },
      /** @type {BounceCountProps} */
      "BounceCount": { value: 0 },
      "Ball": {},
    },
  });

  // Left wall
  world.createEntity({
    c: {
      /** @type {PositionProps} */
      "Position": {
        x: 0,
        y: 0,
      },
      /** @type {ColliderProps} */
      "Collider": {
        width: 1,
        height: getScreenHeight(),
      },
      "Wall": {}
    }
  })

  // Top wall
  world.createEntity({
    c: {
      /** @type {PositionProps} */
      "Position": {
        x: 0,
        y: 0,
      },
      /** @type {ColliderProps} */
      "Collider": {
        width: getScreenWidth(),
        height: 1,
      },
      "Wall": {}
    }
  })

  // Right wall
  world.createEntity({
    c: {
      /** @type {PositionProps} */
      "Position": {
        x: getScreenWidth(),
        y: 0,
      },
      /** @type {ColliderProps} */
      "Collider": {
        width: 1,
        height: getScreenHeight(),
      },
      "Wall": {}
    }
  })

  // Bottom pit
  world.createEntity({
    c: {
      /** @type {PositionProps} */
      "Position": {
        x: 0,
        y: getScreenHeight(),
      },
      /** @type {ColliderProps} */
      "Collider": {
        width: getScreenWidth(),
        height: 1,
      },
      "Pit": {}
    }
  })

  // Bricks
  /** @type {string[][]} */
  const brickLayout = [
    ["#fff", "#666555", "#fff"],
    ["#fff", "hotpink", "#fff"],
    ["#fff", "#fff", "#fff"]
  ]

  const brickEntityConfigs = [];

  for (const [rowIndex, row] of brickLayout.entries()) {
    for (const [colIndex, brickColor] of row.entries()) {
      if (!brickColor) continue;

      brickEntityConfigs.push({
        c: {
          /** @type {PositionProps} */
          "Position": { x: 100 + ((colIndex + 1) * 100), y: 50 + (rowIndex * 30) },
          /** @type {RenderableProps} */
          "Renderable": { width: 80, height: 20, color: brickColor },
          "Collider": { width: 80, height: 20 },
          "Brick": {}
        }
      }); 
    }
  }

  world.createEntities(brickEntityConfigs);
}

/**
 * Main game loop
 */
function gameLoop() {
  world.runSystems("game-loop");
  requestAnimationFrame(gameLoop);
}

createEntities();
gameLoop();