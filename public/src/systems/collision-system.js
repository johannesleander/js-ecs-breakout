import { Position, Collider, Brick, Ball, Pit, Velocity } from '../components.js';

export class CollisionSystem extends ApeECS.System {
    init() {
        this.query = this.world.createQuery().fromAll(Collider, Position).persist();
    }

    update() {
        const entities = Array.from(this.query.execute());
        const entitiesMap = new Map(entities.map(entity => {
            const data = {
                entity,
                collider: entity.getOne(Collider),
                position: entity.getOne(Position),
                velocity: entity.getOne(Velocity),
            }

            return [entity.id, data]
        }))

        const movableEntities = entities.filter(e => e.has(Velocity)).map(e => entitiesMap.get(e.id));
        const staticEntities = entities.filter(e => !e.has(Velocity)).map(e => entitiesMap.get(e.id));


        for (const { entity, collider, position, velocity } of movableEntities) {
            for (const other of [...movableEntities, ...staticEntities]) {
                const { entity: otherEntity, collider: otherCollider, position: otherPosition } = other

                if (entity.id === otherEntity.id) continue;
                if (collider.excludeComponents?.some(c => otherEntity.has(c))) continue;

                const deltaTime = this.world.getEntity('Frame').c['FrameInfo'].deltaTime;

                const simpleCollision = aabbOverlap(
                    { x: position.x, y: position.y },
                    { width: collider.width, height: collider.height },
                    { x: otherPosition.x, y: otherPosition.y },
                    { width: otherCollider.width, height: otherCollider.height },
                )

                if (simpleCollision) continue

                const sweptCollision = sweptCollisionDetection(
                    { x: position.x, y: position.y },
                    { dx: velocity.dx, dy: velocity.dy },
                    { width: collider.width, height: collider.height },
                    { x: otherPosition.x, y: otherPosition.y },
                    { width: otherCollider.width, height: otherCollider.height },
                    deltaTime
                );

                if (!sweptCollision) continue; // No collision this frame

                // Move to collision point
                position.x += velocity.dx * deltaTime * sweptCollision.time;
                position.y += velocity.dy * deltaTime * sweptCollision.time;

                // Reflect the velocity
                if (sweptCollision.normal.x !== 0) velocity.dx *= -1;
                if (sweptCollision.normal.y !== 0) velocity.dy *= -1;

                if (entity.has(Ball) && otherEntity.has(Brick)) {
                    this.world.removeEntity(otherEntity);
                    this.world.runSystems('win');
                }

                if (entity.has(Ball) && otherEntity.has(Pit)) {
                    this.world.removeEntity(entity);
                    this.world.runSystems('lose');
                }
            }
        }
    }
}

/**
 * 
 * @param {import('../components.js').PositionProps} movingPos 
 * @param {import('../components.js').VelocityProps} velocity 
 * @param {Pick<import('../components.js').ColliderProps, 'height' | 'width'>} size 
 * @param {import('../components.js').PositionProps} staticPos 
 * @param {Pick<import('../components.js').ColliderProps, 'height' | 'width'>} staticSize 
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

/**
 * 
 * @param {import('../components.js').PositionProps} pos1 
 * @param {import('../components.js').ColliderProps} size1 
 * @param {import('../components.js').PositionProps} pos2 
 * @param {import('../components.js').ColliderProps} size2 
 * @returns 
 */
function aabbOverlap(pos1, size1, pos2, size2) {
    return (
        pos1.x + size1.width < pos2.x ||
        pos1.x > pos2.x + size2.width ||
        pos1.y + size1.height < pos2.y ||
        pos1.y > pos2.y + size2.height
    );
}
