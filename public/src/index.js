/// <reference path="../../types/ape-ecs-global.d.ts" />
import 'ape-ecs'
import { Position, Renderable, Velocity } from "./components.js";
import { world } from './world.js';

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
}

/**
 * Render all entities with Position and Renderable components
 */
function renderEntities() {
  if (!ctx) throw new Error("No canvas found");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const entities = world.createQuery().fromAll(Position, Velocity).execute();

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
  world.runSystems("movement");
  world.runSystems("ball-collision");
  renderEntities();
  requestAnimationFrame(gameLoop);
}

createEntities();
gameLoop();