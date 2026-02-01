import { _DIAGRAM } from '../imports'
// import { type IDiagram } from '../storage/schema'

type TDiagram = _MAIN & { [key: string]: any };

interface IChildrenStructure {
    none: TDiagram[];
    point: TDiagram[];
    square: TDiagram[];
    line: TDiagram[];
    button: TDiagram[];
}


const _DPR = Math.round(window.devicePixelRatio) || 1;

export class _MAIN 
{
    type:       string = 'none';

    id:         string | null = null;
    parentID:   string | null = null;
    tabID:      string | null = null;
    zIndex:     number | null = null;

    x:          number = 0;
    y:          number = 0;
    w:          number = 0;
    h:          number = 0;
    _capture: {
        cav:    HTMLCanvasElement;
        ctx:    CanvasRenderingContext2D;
    };

    children: IChildrenStructure = {
        none: [],
        point: [],
        square: [],
        line: [],
        button: [],
    };
    // 상속때마다 생성을 막기위해 static으로 선언
    static readonly children_order = ['none','point','square','line','button'] as const;
    static readonly children_order_reverse = [..._MAIN.children_order].reverse();

   

    constructor() {
        const cav = document.createElement('canvas');
        const ctx = cav.getContext('2d') as CanvasRenderingContext2D;
        this._capture = { cav, ctx };
    }

    SetData(args: Partial<any> = {}) {
        Object.assign(this, args);

        if(args.w || args.h) {
            const cavCapture = this._capture.cav;
            const ctxCapture = this._capture.ctx;
            cavCapture.width = args.w * _DPR;
            cavCapture.height = args.h * _DPR;
            ctxCapture.setTransform(1, 0, 0, 1, 0, 0);
            ctxCapture.scale(_DPR, _DPR);
        }
    }

    private GetChildrenByType(type: string): TDiagram[] {
        return (this.children as any)[type] || [];
    }
    get children_order() {
        return _MAIN.children_order;
    }
    get children_order_reverse() {
        return _MAIN.children_order_reverse;
    }
    
    AddChild(args: any)
    {
        const dClass = (_DIAGRAM as any)[args.type];
        if (!dClass) return;

        const instance = new dClass(args);
        const list = this.GetChildrenByType(args.type);
        list.push(instance);
    }

    SetOrderChild(dChild:TDiagram)
    {
        const list = this.GetChildrenByType(dChild.type);
        const index = list.indexOf(dChild);
        if (index > -1) {
            const [dTarget] = list.splice(index, 1);
            list.push(dTarget);
        }
    }

    FindByID(diagramID: string): TDiagram | null 
    {
        // key를 꺼내서 접근할 때 TS 에러를 피하려면 Object.keys 대신 values가 속 편합니다.
        const allLists = Object.values(this.children);

        for (const list of allLists) {
            const found = list.find((item:TDiagram) => item.id === diagramID);
            if (found) return found;
        }
        return null;
    }

    // 자신 체크
    IsCollisionPoint(x:number, y:number): boolean
    {
        return (
            x >= this.x &&
            x <= this.x + this.w &&
            y >= this.y &&
            y <= this.y + this.h
        );
    }
   
    // GetCollisionChildRect(x:number, y:number, w:number, h:number)
    // {

    // }

    // 1. 자신, 2.직전자식까지, 3.전체 subChild까지
    GetCollisionChildPoint(x:number, y:number): TDiagram | null
    {
        for(let dType of this.children_order_reverse) {
            const dChildren = this.children[dType];
            for(let i=dChildren.length-1; i>=0; i--) {
                const dChild = dChildren[i];
                if(dChild.IsCollisionPoint(x, y)) { return dChild; }
            }
        }
        return null;
    }


    Draw(ctxView:CanvasRenderingContext2D)
    {
        const cavCapture = this._capture.cav;
        ctxView.drawImage(cavCapture, this.x, this.y, this.w, this.h);
    }

    DrawHover(ctxView:CanvasRenderingContext2D)
    {
        ctxView.save();
        ctxView.strokeStyle = 'skyblue';
        ctxView.lineWidth = 5;
        ctxView.strokeRect(this.x-6, this.y-6, this.w+12, this.h+12);
        ctxView.restore();
    }

    DrawSelect(ctxView:CanvasRenderingContext2D)
    {
        ctxView.save();
        ctxView.strokeStyle = 'green';
        ctxView.strokeRect(this.x, this.y, this.w, this.h);
        ctxView.restore();
    }

}