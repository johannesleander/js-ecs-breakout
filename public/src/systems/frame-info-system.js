export class FrameInfoSystem extends ApeECS.System {
    init() { }

    update() {
        const frameInfo = this.world.getEntity('Frame').c['FrameInfo'];
        if (!frameInfo) throw new Error('No FrameInfo found')
        const currentTime = performance.now();
        const lastFrameTime = frameInfo.lastUpdate || currentTime;
        frameInfo.deltaTime = (currentTime - lastFrameTime) / 1000; // in seconds
        frameInfo.lastUpdate = currentTime;
    }
}
