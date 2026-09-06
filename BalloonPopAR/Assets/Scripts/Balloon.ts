import { GameManager } from "./GameManager";

@component
export class Balloon extends BaseScriptComponent
{
    @input
    speed: number = 0.3;

    @input
    topBoundaryY: number = 1.1;

    @input
    debugLogging: boolean = false;

    @input
    @allowUndefined
    interactionComponent: InteractionComponent;

    private screenTransform: ScreenTransform;
    private popped: boolean = false;

    onAwake()
    {
        this.screenTransform = this.getSceneObject()
            .getComponent("Component.ScreenTransform");

        this.createEvent("UpdateEvent").bind(() => this.onUpdate());

        this.interactionComponent?.onTap.add(() => this.pop());
    }

    onUpdate()
    {
        if (this.popped || !this.screenTransform) return;

        const step = this.speed * getDeltaTime();
        const anchors = this.screenTransform.anchors;

        // Move both edges by the same amount: translate, never resize.
        anchors.top += step;
        anchors.bottom += step;

        this.screenTransform.anchors = anchors;

        if (this.debugLogging)
        {
            print("Balloon Y: " + anchors.bottom);
        }

        if (anchors.bottom >= this.topBoundaryY)
        {
            this.missedBalloon();
        }
    }

    missedBalloon()
    {
        if (this.popped) return;

        this.popped = true;
        this.getSceneObject().enabled = false;

        GameManager.getInstance()?.loseLife();
    }

    pop()
    {
        if (this.popped) return;

        this.popped = true;
        this.getSceneObject().enabled = false;

        GameManager.getInstance()?.addScore(10);
    }

    resetBalloon()
    {
        this.popped = false;
    }
}
