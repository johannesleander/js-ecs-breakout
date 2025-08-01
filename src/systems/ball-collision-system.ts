import { Ball, PaddleControl, Position, Renderable, Velocity } from '../components.js';

export class BallCollisionSystem extends ApeECS.System {

    init() { }

    update() {
        const entities = this.createQuery().fromAll(Position, Velocity, Ball).execute(); // I couldn't get this working in the init method :(

        if (!entities) return;

        for (const entity of entities) {
            if (!entity.has(Position)) {
                entity.addComponent({
                    type: 'Position',
                    x: 0,
                    y: 0
                });
            }
            const position = entity.getOne(Position);

            if (!entity.has(Velocity)) {
                entity.addComponent({
                    type: 'Velocity',
                    mx: 0,
                    my: 0
                })
            }
            const velocity = entity.getOne(Velocity);

            if (!entity.has(Ball)) continue;
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

            const paddleEntities = this.createQuery().fromAll(Position, Renderable, PaddleControl).execute();
            for (const paddle of paddleEntities) {
                const paddlePos = paddle.getOne(Position);
                const paddleRenderable = paddle.getOne(Renderable)

                const paddleWidth = paddleRenderable?.width;
                const paddleHeight = paddleRenderable?.height;
                const ballRadius = entity.getOne(Renderable)?.width;

                // Simple AABB collision detection
                if (
                    paddlePos &&
                    position.y + ballRadius >= paddlePos.y &&
                    position.y - ballRadius <= paddlePos.y + paddleHeight &&
                    position.x + ballRadius >= paddlePos.x &&
                    position.x - ballRadius <= paddlePos.x + paddleWidth
                ) {
                    velocity.dy *= -1;
                    position.y = paddlePos.y - ballRadius; // Place ball above paddle
                }
            }
        }
    }
}

