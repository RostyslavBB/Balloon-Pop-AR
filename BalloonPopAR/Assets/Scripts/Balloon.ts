@component
export class Balloon extends BaseScriptComponent {
    @input 
    speed: number = 0.3;
    
    @input
    topBoundaryY: number = 1.1;

    @input
    debugLogging: boolean = false;

    private screenTransform!: ScreenTransform;
    private popped: boolean = false;

    onAwake()
    {
        this.screenTransform = this.getSceneObject().getComponent("Component.ScreenTransform");

        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }

    onUpdate()
    {
        if(this.popped) return;

        const step = this.speed * getDeltaTime();
        const anchors = this.screenTransform.anchors;

        anchors.top += step;
        anchors.bottom += step;

        this.screenTransform.anchors = anchors;

        if(this.debugLogging)
        {
            print("Ballon Y: " + anchors.bottom);
        }

        if(anchors.bottom >= this.topBoundaryY)
        {
            this.missedBallon();
        }
    }

    missedBallon()
    {
        this.getSceneObject().enabled = false;
        print("Missed Ballon");
    }
}
