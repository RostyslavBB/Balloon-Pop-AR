import { Balloon } from "./Balloon";
import { GameManager } from "./GameManager";

@component
export class BalloonSpawner extends BaseScriptComponent
{
    @input
    @allowUndefined
    balloonPrefab: ObjectPrefab;

    @input
    @allowUndefined
    spawnRoot: SceneObject;

    @input
    poolSize: number = 10;

    @input
    spawnIntervalSeconds: number = 1.0;

    @input
    spawnXRange: number = 1;

    private pool: SceneObject[] = [];
    private spawnEvent: DelayedCallbackEvent;

    onAwake()
    {
        if (!this.balloonPrefab || !this.spawnRoot)
        {
            print("BalloonSpawner: balloonPrefab or spawnRoot is not assigned");
            return;
        }

        for (let i = 0; i < this.poolSize; i++)
        {
            const balloon = this.balloonPrefab.instantiate(this.spawnRoot);
            balloon.enabled = false;
            this.pool.push(balloon);
        }

        // One reusable event instead of a new one per spawn.
        this.spawnEvent = this.createEvent("DelayedCallbackEvent");
        this.spawnEvent.bind(() => {
            this.spawnBalloon();
            this.spawnEvent.reset(this.spawnIntervalSeconds);
        });
        this.spawnEvent.reset(this.spawnIntervalSeconds);
    }

    private getFromPool(): SceneObject | null
    {
        for (const balloon of this.pool)
        {
            if (!balloon.enabled) return balloon;
        }

        return null;
    }

    spawnBalloon()
    {
        if (GameManager.getInstance()?.isGameOver()) return;

        const balloon = this.getFromPool();
        if (!balloon) return;

        const screenTransform = balloon.getComponent("Component.ScreenTransform");
        if (!screenTransform) return;

        const anchors = screenTransform.anchors;

        // Keep whatever size the prefab was authored with.
        const halfW = (anchors.right - anchors.left) / 2;
        const halfH = (anchors.top - anchors.bottom) / 2;

        // Keep the whole balloon inside the screen, not just its centre.
        const limit = Math.max(0, this.spawnXRange - halfW);
        const randomX = (Math.random() * 2 - 1) * limit;

        anchors.left = randomX - halfW;
        anchors.right = randomX + halfW;
        anchors.bottom = -1.1 - halfH;
        anchors.top = -1.1 + halfH;

        screenTransform.anchors = anchors;

        balloon.getComponent(Balloon.getTypeName())?.resetBalloon();

        balloon.enabled = true;
    }
}
