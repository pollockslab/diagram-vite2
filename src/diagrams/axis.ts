import { _DIAGRAM } from '../imports'

export type TDiagram = _MAIN & { [key: string]: any };

interface IChildrenStructure {
    none: TDiagram[];
    point: TDiagram[];
    square: TDiagram[];
    line: TDiagram[];
    button: TDiagram[];
}
interface ICapture {
    cav:    HTMLCanvasElement,
    ctx:    CanvasRenderingContext2D,
    x: number, 
    y: number,
}

export const EDGE_TYPES = ['e', 'w', 's', 'n', 'es', 'en', 'ws', 'wn', null] as const;
export type TEdgeType = (typeof EDGE_TYPES)[number];

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
    _w:         number = 100;
    _h:         number = 100;
    _capture!: ICapture;

    children: IChildrenStructure = {
        none: [],
        point: [],
        square: [],
        line: [],
        button: [],
    };
    
    static readonly children_order = ['none','point','square','line','button'] as const;
    static readonly children_order_reverse = [..._MAIN.children_order].reverse();

    constructor() {
        
    }

    get w()
    {
        return this._w;
    }
    set w(size)
    {
        if(100 <= size && size <= 1000) this._w = size;
    }

    get h()
    {
        return this._h;
    }
    set h(size)
    {
        if(100 <= size && size <= 1000) this._h = size;
    }

    SetData(args: Partial<any> = {}) {
        Object.assign(this, args);
    }

    SetCapture(capture:ICapture)
    {
        this._capture = capture;
        this.Render();
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
    
    AddChild(args: any): TDiagram|null
    {
        const dClass = (_DIAGRAM as any)[args.type];
        if (!dClass) return null;
        
        const instance = new dClass(args);
        const list = this.GetChildrenByType(args.type);
        list.push(instance);
        return instance;
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
        
        const allLists = Object.values(this.children);

        for (const list of allLists) {
            const found = list.find((item:TDiagram) => item.id === diagramID);
            if (found) return found;
        }
        return null;
    }

    FindByIDAndType(diagramID: string, diagramType: string): TDiagram | null 
    {
        const list = this.GetChildrenByType(diagramType);
        const found = list.find((item:TDiagram) => item.id === diagramID);
        if (found) return found;
    
        return null;
    }

    GetAllChildren(): Array<TDiagram>
    {
        const temps:Array<TDiagram> = [];
        const allLists = Object.values(this.children);
        for (const list of allLists) {
            for(const diagram of list) {
                temps.push(diagram);
            }
        }
        return temps;
    }

    IsCollisionPoint(x:number, y:number): boolean
    {
        return (
            x >= this.x &&
            x <= this.x + this.w &&
            y >= this.y &&
            y <= this.y + this.h
        );
    }
   
    // GetCollisionChildRect(x:number, y:number, w:number, h:number): TDiagram[] | []
    // {
    //     return [];
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

    GetCollisionEdge(x:number, y:number):TEdgeType
    {
        if(!this.IsCollisionPoint(x, y)) {return null;}
        
        const lw = 10; // lineWidth

        const left = this.x;
        const right = this.x + this.w;
        const top = this.y;
        const bottom = this.y + this.h;
        
        let arrow = '';

        if      (Math.abs(x - right)  <= lw) arrow += 'e';
        else if (Math.abs(x - left)   <= lw) arrow += 'w';
        if      (Math.abs(y - bottom) <= lw) arrow += 's';
        else if (Math.abs(y - top)    <= lw) arrow += 'n';

        if ((EDGE_TYPES as readonly string[]).includes(arrow)) {
            return arrow as TEdgeType;
        }
        return null;
    }

    Render() {} // 각 다이어그램에서 초기화 필요

    Draw(ctxView:CanvasRenderingContext2D)
    {
        ctxView.drawImage(
            this._capture.cav,
            this._capture.x* _DPR,
            this._capture.y* _DPR,
            this.w * _DPR, 
            this.h * _DPR,
            this.x, 
            this.y, 
            this.w, 
            this.h
        );
    }

    DrawHover(ctxView:CanvasRenderingContext2D)
    {
        const padding = 3; 

        ctxView.save();
        ctxView.strokeStyle = 'skyblue';
        ctxView.lineWidth = 6;
        ctxView.strokeRect(
            this.x+padding, 
            this.y+padding, 
            this.w-padding*2, 
            this.h-padding*2
        );
        ctxView.restore();
    }

    DrawSelect(ctxView:CanvasRenderingContext2D)
    {
        const padding = 3; 

        ctxView.save();
        ctxView.strokeStyle = 'green';
        ctxView.lineWidth = 6;
        ctxView.strokeRect(
            this.x+padding, 
            this.y+padding, 
            this.w-padding*2, 
            this.h-padding*2
        );
        ctxView.restore();
    }

}