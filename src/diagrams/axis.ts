
import { type _DT, _DC } from './diagrams.type'


const _DPR = Math.round(window.devicePixelRatio) || 1;
const _CAPTURE_EXPAND = {
    w: 1024,
    h: 1024,   
};

export class _MAIN implements _DT.AXIS
{
    type:       string = 'axis';

    id:         string | null = null;
    parentID:   string | null = null;
    tabID:      string | null = null;
    zIndex:     number | null = null;

    x:          number = 0;
    y:          number = 0;
    _w:         number = 100;
    _h:         number = 100;

    text:       string  = '';

    _capture:   _DT.CAPTURE;

    children = {
        none:   [] as _DT.CHILD_OBJECT[],
        point:  [] as _DT.CHILD_OBJECT[],
        square: [] as _DT.CHILD_OBJECT[],
        line:   [] as _DT.CHILD_OBJECT[],
        button: [] as _DT.CHILD_OBJECT[],
    };

    constructor() 
    {
        const cav = document.createElement('canvas');
        const ctx = cav.getContext('2d') as CanvasRenderingContext2D;
        this._capture = {
            cav: cav, ctx: ctx
        };

        this.InitCapture(0);
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

    get serialize() 
    {
        const data:_DT.AXIS = {
            type:       this.type,

            id:         this.id,
            parentID:   this.parentID,
            tabID:      this.tabID,
            zIndex:     this.zIndex,

            x:          this.x,
            y:          this.y,
            w:          this.w,
            h:          this.h,

            text:       '',
        };
        return data; 
    } 

    SetData(args: Partial<any> = {}) {
        Object.assign(this, args);
    }

    /**
     * 캡처용 캔버스 초기화( 최대크기로 초기화할지 판단 )
     * @param isExpand 0:compact, 1:expand
     */
    InitCapture(isExpand: 0 | 1)
    {
        const w = isExpand === 1 ? _CAPTURE_EXPAND.w : this.w;
        const h = isExpand === 1 ? _CAPTURE_EXPAND.h : this.h;
        const cav = this._capture.cav;
        cav.width = w * _DPR;
        cav.height = h * _DPR;
        cav.style = 
            `position:absolute; float:right; top:100px;` +
            `right: ${w/10}px; width: ${w/10}px; height: ${h/10}px;` +
            `border: 1px solid gold;`;

        const ctx = this._capture.ctx;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(_DPR, _DPR);
    }

    private GetChildrenByType(type: string): _DT.CHILD_OBJECT[] {
        return (this.children as any)[type] || [];
    }
    
    AddChild(args: any): _DT.CHILD_OBJECT | null
    {
        const dClass = _DC.GET_CLASS_BY_NAME(args.type);
        if (!dClass) return null;
        
        const instance = new dClass(args);
        instance.InitCapture(0);
        instance.Render();
        const list = this.GetChildrenByType(args.type);
        list.push(instance);
        return instance;
    }
    DeleteChild(dChild: _DT.CHILD_OBJECT)
    {
        const list = this.GetChildrenByType(dChild.type);
        const index = list.indexOf(dChild);
        if (index > -1) {
            list.splice(index, 1);
        }
    }

    SetOrderChild(dChild: _DT.CHILD_OBJECT)
    {
        const list = this.GetChildrenByType(dChild.type);
        const index = list.indexOf(dChild);
        if (index > -1) {
            const [dTarget] = list.splice(index, 1);
            list.push(dTarget);
        }
    }

    FindByID(diagramID: string): _DT.CHILD_OBJECT | null 
    {
        const allLists = Object.values(this.children);

        for (const list of allLists) {
            const found = list.find((item: _DT.CHILD_OBJECT) => item.id === diagramID);
            if (found) return found;
        }
        return null;
    }

    FindByIDAndType(diagramID: string, diagramType: string): _DT.CHILD_OBJECT | null 
    {
        const list = this.GetChildrenByType(diagramType);
        const found = list.find((item: _DT.CHILD_OBJECT) => item.id === diagramID);
        if (found) return found;
    
        return null;
    }

    GetAllChildren(): _DT.CHILD_OBJECT[]
    {
        const temps:_DT.CHILD_OBJECT[] = [];
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
    GetCollisionChildPoint(x:number, y:number): _DT.CHILD_OBJECT | null
    {
        for(let nOrder=_DC.CHILD_ORDER.length-1; nOrder>=0; nOrder--) {
            const childName = _DC.CHILD_ORDER[nOrder];
            const dChildren = this.GetChildrenByType(childName);
            for(let i=dChildren.length-1; i>=0; i--) {
                const dChild = dChildren[i];
                if(dChild.IsCollisionPoint(x, y)) { return dChild; }
            }
        }
        return null;
    }

    GetCollisionEdge(x:number, y:number): _DT.EDGE_NAME
    {
        if(!this.IsCollisionPoint(x, y)) {return null;}
        
        const lineWidth = 10;

        const left      = this.x;
        const right     = this.x + this.w;
        const top       = this.y;
        const bottom    = this.y + this.h;
        
        let arrow = '';

        if      (Math.abs(x - right)  <= lineWidth) arrow += 'e';
        else if (Math.abs(x - left)   <= lineWidth) arrow += 'w';
        if      (Math.abs(y - bottom) <= lineWidth) arrow += 's';
        else if (Math.abs(y - top)    <= lineWidth) arrow += 'n';

        return (arrow || null) as _DT.EDGE_NAME;
    }

    Render() {} // 각 다이어그램에서 초기화 필요

    Draw(ctxView:CanvasRenderingContext2D)
    {
        ctxView.drawImage(
            this._capture.cav,
            0, 
            0, 
            this.w*_DPR, 
            this.h*_DPR,
            this.x, 
            this.y, 
            this.w, 
            this.h,
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