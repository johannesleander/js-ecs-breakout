import { Brick } from "../components.js";

export class WinSystem extends ApeECS.System {
    init() {
        this.bricksQuery = this.world.createQuery().fromAll(Brick).persist();
    }
    update() {
        const entities = this.bricksQuery.execute()
        if (entities.size <= 0) alert('You won!')
    }
}