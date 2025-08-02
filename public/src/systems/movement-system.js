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

            position.x += velocity.dx;
            position.y += velocity.dy;
            // position.x = position.x + velocity.dx * deltaTime
            // position.y = position.y + velocity.dy * deltaTime


            console.log(1, position.x);
            console.log(2, position.x + velocity.dx);
            console.log(3, position.x + velocity.dx * deltaTime);
            // console.log(velocity.dy * deltaTime + position.y);
        }
    }
}