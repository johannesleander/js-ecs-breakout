import { Position, Collider, Brick, Paddle, Ball, Pit, Velocity, BounceCount } from '../components.js';

export class CollisionSystem extends ApeECS.System {
    init() {
        this.collidersQuery = this.world.createQuery().fromAll(Collider, Position, Velocity).persist();
    }

    update() {
        const entities = this.collidersQuery.execute();

        for (const entity of entities) {
            if (!entity.has(Ball)) continue;

            const collider = entity.getOne(Collider);
            const position = entity.getOne(Position);
            const velocity = entity.getOne(Velocity);

            if (!collider) throw new Error('No Collider found');
            if (!position) throw new Error('No Position found');
            if (!velocity) throw new Error('No Velocity found');

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
                    // Death
                    this.world.removeEntity(entity);
                    throw new Error("You died! (This shouldn't be an error)")
                }

                if (entity.has(Ball) && otherEntity.has(Paddle)) {
                    const velocity = entity.getOne(Velocity);
                    // Bounce off other entity
                    velocity.dy *= -1;
                    // Change x direction based on where on the paddle the ball was struck
                    const paddleCenter = otherPosition.x + (otherCollider.width / 2);
                    const ballCenter = position.x + (collider.width / 2);
                    const offset = ballCenter - paddleCenter;
                    const horizontalBounceFactor = 0.05;
                    velocity.dx = offset * horizontalBounceFactor

                    const bounceCount = entity.getOne(BounceCount);
                    if (!bounceCount) throw new Error('No BounceCount found')
                    const maxBounceIncreaseTimes = 20

                    if (bounceCount.value ?? 0 < maxBounceIncreaseTimes) {
                        const speedIncrease = 1.05
                        velocity.dx *= speedIncrease;
                        velocity.dy *= speedIncrease;
                        bounceCount.value += 1
                    }
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
    const entry = {};
    const exit = {};

    if (velocity.dx > 0) {
        entry.x = staticPos.x - (movingPos.x + size.width);
        exit.x = (staticPos.x + staticSize.width) - movingPos.x;
    } else {
        entry.x = (staticPos.x + staticSize.width) - movingPos.x;
        exit.x = staticPos.x - (movingPos.x + size.width);
    }

    if (velocity.dy > 0) {
        entry.y = staticPos.y - (movingPos.y + size.height);
        exit.y = (staticPos.y + staticSize.height) - movingPos.y;
    } else {
        entry.y = (staticPos.y + staticSize.height) - movingPos.y;
        exit.y = staticPos.y - (movingPos.y + size.height);
    }

    const entryTimeX = velocity.dx === 0 ? -Infinity : entry.x / (velocity.dx * deltaTime);
    const entryTimeY = velocity.dy === 0 ? -Infinity : entry.y / (velocity.dy * deltaTime);
    const exitTimeX = velocity.dx === 0 ? Infinity : exit.x / (velocity.dx * deltaTime);
    const exitTimeY = velocity.dy === 0 ? Infinity : exit.y / (velocity.dy * deltaTime);

    const entryTime = Math.max(entryTimeX, entryTimeY);
    const exitTime = Math.min(exitTimeX, exitTimeY);

    // No collision if entry is after exit or out of bounds
    if (entryTime > exitTime || entryTime < 0 || entryTime > 1) {
        return null;
    }

    // Determine normal of the collision
    let normalX = 0;
    let normalY = 0;

    if (entryTimeX > entryTimeY) {
        normalX = velocity.dx < 0 ? 1 : -1;
    } else {
        normalY = velocity.dy < 0 ? 1 : -1;
    }

    return {
        time: entryTime,
        normal: { x: normalX, y: normalY },
    };
}