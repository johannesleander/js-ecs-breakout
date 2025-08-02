import { Ball, Position, Velocity } from "../components.js";
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

            position.x = position.x + velocity.dx * deltaTime
            position.y = position.y + velocity.dy * deltaTime


            if (entity.has(Ball)) {
                // console.log(position.x)
                console.log('velocity.dx:', velocity.dx, 'type:', typeof velocity.dx);
                console.log('deltaTime:', deltaTime);
                // console.log(position.x);
                // console.log(2, position.x + velocity.dx);
                // console.log(3, position.x + velocity.dx * deltaTime);
            }
        }
    }
}