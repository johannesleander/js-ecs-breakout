/// <reference path="../../types/ape-ecs-global.d.ts" />
import 'ape-ecs'
import { Position, Renderable, Velocity } from "./components.js";
import { world } from './world.js';
/**
 * A number, or a string containing a number.
 * @typedef {(`#${string}`)[][]} BrickLayout
 */

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("gameCanvas"));
const ctx = canvas.getContext("2d");

/**
 * Create game entities (paddle and ball)
 */
function createEntities() {
  // Paddle
  world.createEntity({
    c: {
      "Position": { x: 350, y: 580 },
      "Velocity": { dx: 0, dy: 0 },
      "Renderable": { width: 100, height: 20, color: "white" },
      "PaddleControl": {},
    },
  });

  // Ball
  world.createEntity({
    c: {
      "Position": { x: 390, y: 300 },
      "Velocity": { dx: 3, dy: -3 },
      "Renderable": { width: 10, height: 10, color: "red" },
      "Ball": {},
    },
  });

  /** @type {BrickLayout} */
  const brickLayout = [
    ["#fff", "#fff", "#fff"],
    ["#fff", "#fff", "#fff"],
    ["#fff", "#fff", "#fff"]
  ]

  for (const [rowIndex, row] of brickLayout.entries()) {
    for (const [brickInRowIndex, brickColor] of row.entries()) {
      if (!brickColor) continue;

      world.createEntity({
        c: {
          "Position": { x: 100 + ((brickInRowIndex + 1) * 100), y: 50 + (rowIndex * 30) },
          "Renderable": { width: 80, height: 20, color: brickColor },
          "Brick": {}
        }
      }); 
    }
  }
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
    const render = entity.getOne(Renderable);
    if (!render) continue;
    if (!position) continue;

    ctx.fillStyle = render.color;
    ctx.fillRect(position.x, position.y, render.width, render.height);
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