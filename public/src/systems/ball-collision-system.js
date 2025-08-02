import { Ball, Brick, Paddle, Position, Renderable, Velocity } from '../components.js';

export class BallCollisionSystem extends ApeECS.System {
    init() {
        this.ballQuery = this.createQuery().fromAll(Ball).persist();
        this.paddleQuery = this.createQuery().fromAll(Paddle).persist();
        this.brickQuery = this.createQuery().fromAll(Brick);
    }

    update() {
        const ballEntities = this.ballQuery?.execute() ?? [];

        for (const ball of ballEntities) {
            const position = ball.getOne(Position);
            const velocity = ball.getOne(Velocity);

            if (!ball.has(Ball)) continue;
            if (!velocity) continue;
            if (!position) continue;

            position.x += velocity.dx;
            position.y += velocity.dy;

            // Bounce off left/right walls
            if (position.x <= 0 || position.x >= 800) {
                velocity.dx *= -1;
                position.x = Math.max(0, Math.min(position.x, 800));
            }

            // Bounce off top wall
            if (position.y <= 0) {
                velocity.dy *= -1;
                position.y = 0;
            }


            const paddleEntities = this.paddleQuery?.execute() || [];
            const brickEntities = this.brickQuery?.execute() || [];


            for (const otherEntity of [...paddleEntities, ...brickEntities]) {
                const otherPosition = otherEntity.getOne(Position);
                const otherEntityRenderable = otherEntity.getOne(Renderable)
                const otherWidth = otherEntityRenderable?.width;
                const otherHeight = otherEntityRenderable?.height;

                const ballRenderable = ball.getOne(Renderable);
                const ballWidth = ballRenderable?.width;

                if (!(otherPosition instanceof Position) || typeof otherWidth !== "number" || typeof otherHeight !== "number" && typeof ballWidth !== "number") continue;

                const isBallColliding =
                    position.x < otherPosition.x + otherWidth &&
                    position.x + ballWidth > otherPosition.x &&
                    position.y < otherPosition.y + otherHeight &&
                    position.y + ballWidth > otherPosition.y;

                if (!isBallColliding) continue;

                // Bounce off other entity
                velocity.dy *= -1;

                // Adjust position to avoid sticking

                if (otherEntity.has(Brick)) {
                    this.world.removeEntity(otherEntity);
                }

                if (otherEntity.has(Paddle)) {
                    // Change x direction based on where on the paddle the ball was struck
                    const paddleCenter = otherPosition.x + (otherWidth / 2);
                    const ballCenter = position.x + (ballWidth / 2);
                    const offset = ballCenter - paddleCenter;
                    const bounceFactor = 0.1; // Adjust this value to change bounce sensitivity
                    velocity.dx = offset * bounceFactor;
                }
            }
        }
    }
}
