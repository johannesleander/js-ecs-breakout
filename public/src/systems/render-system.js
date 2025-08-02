import { Position, Renderable } from '../components.js';
import { world } from '../world.js'

export class RenderSystem extends ApeECS.System {
    init() {

        this.canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("gameCanvas"));
        this.ctx = this.canvas.getContext("2d");
    }

    update() {
        const ctx = this.ctx;
        const canvas = this.canvas;

        /**
         * Render all entities with Position and Renderable components
         */
        if (!canvas) throw new Error("No context found");
        if (!ctx) throw new Error("No context found");

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
}