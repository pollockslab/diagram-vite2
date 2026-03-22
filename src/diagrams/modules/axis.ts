
import * as DiagramsType from '../diagrams.type'
import { _DPR } from '../../main'
import { Capture } from './axis.capture'



export class Axis implements DiagramsType.serialize.Axis {

    tab = {
        id: null as string | null,
    };
    parent = {
        id: null as string | null,
    };
    axis = {
        type    : 'axis' as DiagramsType.ClassName,
        id      : null as string | null,
        zIndex  : null as number | null,
        x       : 0 as number,
        y       : 0 as number,
        w       : 100 as number,
        h       : 100 as number,
    };
    capture : Capture;
    children: DiagramsType.Children = {
        axis: [],
        // none:   [],
        // point:  [],
        square: [],
        // line:   [],
        // button: [],
    };

    constructor() {
        this.capture = new Capture(this);
        this.capture.InitCapture(0);
    }

    get type() {
        return this.axis.type;
    }
    set type(value) {
        this.axis.type = value;
    }

    get id() {
        return this.axis.id;
    }
    set id(value) {
        this.axis.id = value;
    }
    
    get zIndex() {
        return this.axis.zIndex;
    }
    set zIndex(value) {
        this.axis.zIndex = value;
    }

    get x() {
        return this.axis.x;
    }
    set x(size) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.axis.x = (!Number.isFinite(size))? 0 : size;
    }

    get y() {
        return this.axis.y;
    }
    set y(size) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.axis.y = (!Number.isFinite(size))? 0 : size;
    }

    get w() {
        return this.axis.w;
    }
    set w(size) {
        if(100 <= size && size <= 1000) this.axis.w = size;
    }

    get h() {
        return this.axis.h;
    }
    set h(size) {
        if(100 <= size && size <= 1000) this.axis.h = size;
    }

    get serialize(): DiagramsType.serialize.Axis {
        return {
            tab: {
                id: this.tab.id,
            },
            parent: {
                id: this.parent.id,
            },
            axis: {
                type:       this.type,
                id:         this.id,
                zIndex:     this.zIndex,
                x:          this.x,
                y:          this.y,
                w:          this.w,
                h:          this.h,
            },
        };
    } 

    SetData(args: Partial<any> = {}) {
        Object.assign(this, args);
    }
    
    Render() {} // 각 다이어그램에서 초기화 필요

    Draw(ctxView:CanvasRenderingContext2D)
    {
        ctxView.drawImage(
            this.capture.cav,
            0, 
            0, 
            this.w*_DPR.value, 
            this.h*_DPR.value,
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