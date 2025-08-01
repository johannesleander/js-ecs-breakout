/// <reference path="../../types/ape-ecs-global.d.ts" />
import 'ape-ecs'
import { Position, Renderable } from "./components.js";
import { world } from './world.js';

/** 
 * @typedef {import("./components.js").PositionProps} PositionProps
 * @typedef {import("./components.js").VelocityProps} VelocityProps
 * @typedef {import("./components.js").RenderableProps} RenderableProps
 * @typedef {string[][]} BrickLayout
 */

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("gameCanvas"));
const ctx = canvas.getContext("2d");

function createEntities() {
  // Paddle
  world.createEntity({
    c: {
      /** @type {PositionProps} */
      "Position": { x: 350, y: 580 },
      /** @type {VelocityProps} */
      "Velocity": { dx: 0, dy: 0 },
      /** @type {RenderableProps} */
      "Renderable": { width: 100, height: 20, color: "hotpink" },
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
      "Velocity": { dx: 3, dy: 3 },
      /** @type {RenderableProps} */
      "Renderable": { width: 10, height: 10, color: "red" },
      "Ball": {},
    },
  });

  // Bricks
  /** @type {BrickLayout} */
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
          "Brick": {}
        }
      }); 
    }
  }

  world.createEntities(brickEntityConfigs);
}

/**
 * Render all entities with Position and Renderable components
 */
function renderEntities() {
  if (!ctx) throw new Error("No canvas found");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const entities = world.createQuery().fromAll(Position, Renderable).execute();

  for (const entity of entities) {
    const position = entity.getOne(Position);
    const renderable = entity.getOne(Renderable);
    if (!renderable) continue;
    if (!position) continue;

    ctx.fillStyle = renderable.color;
    ctx.fillRect(position.x, position.y, renderable.width, renderable.height);
  }
}

/**
 * Main game loop
 */
function gameLoop() {
  world.runSystems("game-loop");
  renderEntities();
  requestAnimationFrame(gameLoop);
}

createEntities();
gameLoop();