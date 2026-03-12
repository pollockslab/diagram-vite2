
import * as DiagramsType from './diagrams.type'


const _DPR = Math.round(window.devicePixelRatio) || 1;
const _CAPTURE_EXPAND = {
    w: 1024,
    h: 1024,   
};

export abstract class Axis
{
    type:       DiagramsType.ClassName = 'axis';

    id:         string | null = null;
    parentID:   string | null = null;
    tabID:      string | null = null;
    zIndex:     number | null = null;

    x:          number = 0;
    y:          number = 0;
    _w:         number = 100;
    _h:         number = 100;

    text:       string  = '';

    _capture:   DiagramsType.Capture;

    children: DiagramsType.Children = {
        axis: [],
        // none:   [],
        // point:  [],
        square: [],
        // line:   [],
        // button: [],
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

    get serialize(): DiagramsType.AxisSerialize
    {
        return {
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