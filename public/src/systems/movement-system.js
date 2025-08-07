import { PaddleController, Position, Velocity } from "../components.js";
import { world } from "../world.js";

export class MovementSystem extends ApeECS.System {
    init() {
        this.query = world.createQuery().fromAll(Position, Velocity).persist();
    }
    update() {
        const deltaTime = this.world.getEntity('Frame').c['FrameInfo'].deltaTime;

        for (const entity of this.query.execute()) {
            const position = entity.getOne(Position);
            const velocity = entity.getOne(Velocity);

            position.x += velocity.dx * deltaTime
            position.y += velocity.dy * deltaTime
        }
    }
}
