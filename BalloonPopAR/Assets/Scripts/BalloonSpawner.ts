import { Balloon } from "./Balloon";

@component
export class BalloonSpawner extends BaseScriptComponent 
{
    @input
    balloonPrefab: ObjectPrefab | null = null;

    @input
    spawnRoot: SceneObject | null = null;

    @input
    poolSize: number = 10;

    @input
    spawnIntervalSeconds: number = 1.0;

    @input
    spawnXRange: number = 1;

    private pool: SceneObject[] = [];

    onAwake() 
    {
        for (let i = 0; i < this.poolSize; i++)
        {
            const balloon = this.balloonPrefab?.instantiate(this.spawnRoot!);
            
            if (balloon)
            {
                balloon.enabled = false;
                this.pool.push(balloon);
            }
        }
        
        this.schedulateNextSpawn();
    }

    private getFromPool(): SceneObject | null
    {
        for (const balloon of this.pool)
        {
            if (!balloon.enabled) return balloon;
        }

        return null;
    }

    schedulateNextSpawn()
    {
        const event = this.createEvent("DelayedCallbackEvent");
        event.bind(() => {
            this.spawnBalloon();
            this.schedulateNextSpawn();
        });

        event.reset(this.spawnIntervalSeconds);
    }

    spawnBalloon()
    {
        const balloon = this.getFromPool();

        if(!balloon) return;

        const balloonComponent = balloon.getComponent(Balloon.getTypeName()) as Balloon | null;
        balloonComponent!.resetBalloon();

        const screenTransform = balloon.getComponent("Component.ScreenTransform") as ScreenTransform | null;
        const randomX = (Math.random() * 2 - 1) * this.spawnXRange;
        const halfWidth = 0.1;   
        const halfHeight = 0.12;
        const anchors = screenTransform!.anchors;

        anchors.left = randomX - halfWidth;
        anchors.right = randomX + halfWidth;
        anchors.top = -1.1 + halfHeight;
        anchors.bottom = -1.1 - halfHeight;

        screenTransform!.anchors = anchors;

        balloon.enabled = true;
    }
}
