import { Position, Velocity } from "../components.js";
import { world } from "../world.js";

export class MovementSystem extends ApeECS.System {
    init() {
        this.movableQuery = world.createQuery().fromAll(Position, Velocity).persist();
    }
    update() {
        const entities = this.movableQuery.execute();
        const deltaTime = this.world.getEntity('Frame').c['FrameInfo'].deltaTime;

        for (const entity of entities) {
            const position = entity.getOne(Position);
            const velocity = entity.getOne(Velocity);

            if (!velocity) continue;
            if (!position) continue;

            position.x += velocity.dx * deltaTime
            position.y += velocity.dy * deltaTime
        }
    }
}