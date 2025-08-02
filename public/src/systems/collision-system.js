import { Position, Collider, Brick, Ball, Pit, Velocity } from '../components.js';

export class CollisionSystem extends ApeECS.System {
    init() {
        this.collidersQuery = this.world.createQuery().fromAll(Collider, Position).persist();
    }

    update() {
        const entities = this.collidersQuery.execute();

        for (const entity of entities) {
            const collider = entity.getOne(Collider);
            const position = entity.getOne(Position);
            const velocity = entity.getOne(Velocity);

            if (!collider) throw new Error('No Collider found');
            if (!position) throw new Error('No Position found');
            if (!velocity) continue // static objects can't bounce 🤷

            for (const otherEntity of entities) {
                if (entity.id === otherEntity.id) continue;

                const otherCollider = otherEntity.getOne(Collider)
                const otherPosition = otherEntity.getOne(Position);

                if (!otherCollider) throw new Error('No Collider found')
                if (!otherPosition) throw new Error('No Position found')

                const deltaTime = this.world.getEntity('Frame').c['FrameInfo'].deltaTime;

                const collision = sweptCollisionDetection(
                    { x: position.x, y: position.y },
                    { dx: velocity.dx, dy: velocity.dy },
                    { width: collider.width, height: collider.height },
                    { x: otherPosition.x, y: otherPosition.y },
                    { width: otherCollider.width, height: otherCollider.height },
                    deltaTime
                );

                if (!collision) continue; // No collision this frame
                console.log(`${entity.id} collided ${otherEntity.id}`)

                // Move to collision point
                position.x += velocity.dx * deltaTime * collision.time;
                position.y += velocity.dy * deltaTime * collision.time;

                // Reflect the velocity
                if (collision.normal.x !== 0) velocity.dx *= -1;
                if (collision.normal.y !== 0) velocity.dy *= -1;

                if (entity.has(Ball) && otherEntity.has(Brick)) {
                    this.world.removeEntity(otherEntity);
                }

                if (entity.has(Ball) && otherEntity.has(Pit)) {
                    this.world.removeEntity(entity);
                    alert('You lost :(') 
                }
            }
        }
    }
}

/**
 * 
 * @param {import('../components.js').PositionProps} movingPos 
 * @param {import('../components.js').VelocityProps} velocity 
 * @param {import('../components.js').ColliderProps} size 
 * @param {import('../components.js').PositionProps} staticPos 
 * @param {import('../components.js').ColliderProps} staticSize 
 * @param {number} deltaTime 
 * @returns 
 */
function sweptCollisionDetection(movingPos, velocity, size, staticPos, staticSize, deltaTime) {
    const moveX = velocity.dx * deltaTime;
    const moveY = velocity.dy * deltaTime;

    const entry = {};
    const exit = {};

    if (moveX > 0) {
        entry.x = staticPos.x - (movingPos.x + size.width);
        exit.x = (staticPos.x + staticSize.width) - movingPos.x;
    } else {
        entry.x = (staticPos.x + staticSize.width) - movingPos.x;
        exit.x = staticPos.x - (movingPos.x + size.width);
    }

    if (moveY > 0) {
        entry.y = staticPos.y - (movingPos.y + size.height);
        exit.y = (staticPos.y + staticSize.height) - movingPos.y;
    } else {
        entry.y = (staticPos.y + staticSize.height) - movingPos.y;
        exit.y = staticPos.y - (movingPos.y + size.height);
    }

    const entryTimeX = moveX === 0 ? -Infinity : entry.x / moveX;
    const entryTimeY = moveY === 0 ? -Infinity : entry.y / moveY;
    const exitTimeX = moveX === 0 ? Infinity : exit.x / moveX;
    const exitTimeY = moveY === 0 ? Infinity : exit.y / moveY;

    const entryTime = Math.max(entryTimeX, entryTimeY);
    const exitTime = Math.min(exitTimeX, exitTimeY);

    if (entryTime > exitTime || entryTime < 0 || entryTime > 1) {
        return null;
    }

    let normalX = 0;
    let normalY = 0;

    if (entryTimeX > entryTimeY) {
        normalX = moveX < 0 ? 1 : -1;
    } else {
        normalY = moveY < 0 ? 1 : -1;
    }

    return {
        time: entryTime,
        normal: { x: normalX, y: normalY }
    };
}
