import { Ball, Paddle, Position, Renderable, Velocity } from "../components.js";

export class MovementSystem extends ApeECS.System {
    _leftPressed = false;
    _rightPressed = false;

    init() {
        this.paddleQuery = this.createQuery().fromAll(Paddle).persist();

        window.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") this._leftPressed = true;
            if (e.key === "ArrowRight") this._rightPressed = true;
        });

        window.addEventListener("keyup", (e) => {
            if (e.key === "ArrowLeft") this._leftPressed = false;
            if (e.key === "ArrowRight") this._rightPressed = false;
        });
    }

    update() {
        const entities = this.paddleQuery?.execute();

        if (!entities) return;

        for (const entity of entities) {
            if (!entity.has(Position)) {
                entity.addComponent({
                    type: Position,
                    x: 0,
                    y: 0
                });
            }
            const position = entity.getOne(Position);

            if (!entity.has(Velocity)) {
                entity.addComponent({
                    type: Velocity,
                    mx: 0,
                    my: 0
                })
            }
            const velocity = entity.getOne(Velocity);

            if (!entity.has(Paddle) || !velocity || !position) continue;

            velocity.dx = 0;

            if (this._leftPressed) velocity.dx = -6;
            if (this._rightPressed) velocity.dx = 6;

            position.x += velocity.dx;
            position.y += velocity.dy;

            position.x = Math.max(0, Math.min(position.x, 800));
        }
    }
}

