import { PaddleController, Position, Velocity } from "../components.js";

export class PaddleControllerSystem extends ApeECS.System {
    _leftPressed = false;
    _rightPressed = false;

    init() {
        this.query = this.createQuery().fromAll(PaddleController).persist();

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
        for (const entity of this.query.execute()) {
            const position = entity.getOne(Position);
            const velocity = entity.getOne(Velocity);

            if (!position) continue;
            if (!velocity) continue;

            const speed = 200;
            if (this._leftPressed) { velocity.dx = -speed }
            else if (this._rightPressed) { velocity.dx = speed }
            else { velocity.dx = 0 }
        }
    }
}
