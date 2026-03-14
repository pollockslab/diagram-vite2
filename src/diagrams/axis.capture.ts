
import { _DPR } from '../main'
import * as DiagramsType from './diagrams.type'


export class Capture {

    parent: DiagramsType.Instance;
    cav: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    size = {
        max: {
            w: 1024 as number,
            h: 1024 as number,   
        },
    };

    constructor(axis: DiagramsType.Instance) {
        this.parent = axis;
        this.cav = document.createElement('canvas');
        this.ctx = this.cav.getContext('2d') as CanvasRenderingContext2D;
    }

    /**
     * 캡처용 캔버스 초기화( 최대크기로 초기화할지 판단 )
     * @param isExpand 0:compact, 1:expand
     */
    InitCapture(isExpand: 0 | 1) {
        const w = isExpand === 1 ? this.size.max.w : this.parent.w;
        const h = isExpand === 1 ? this.size.max.h : this.parent.h;
        
        this.cav.width = w * _DPR.value;
        this.cav.height = h * _DPR.value;
        this.cav.style = 
            `position:absolute; float:right; top:100px;` +
            `right: ${w/10}px; width: ${w/10}px; height: ${h/10}px;` +
            `border: 1px solid gold;`;

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(_DPR.value, _DPR.value);
    }
}