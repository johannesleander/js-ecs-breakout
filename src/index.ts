import { Position, Renderable, Velocity } from "./components";
import { world } from "./world";

declare global {
  interface Window {
    world: typeof world;
  }
}

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
window.world = world;

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

function gameLoop() {
  world.runSystems("movement");
  renderEntities();
  requestAnimationFrame(gameLoop);
}

createEntities();
gameLoop();