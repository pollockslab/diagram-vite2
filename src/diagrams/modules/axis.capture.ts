
import { _DPR } from '../../main'
import * as DiagramsType from '../diagrams.type'


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
     * [Function] InitCapture
     * @param isExpand 0:compact, 1:expand
     * @description 캡처용 캔버스 해상도 최적화 및 리사이징
     * * [Optimize]
     * 1. 리사이징 중(Expand): 매 프레임 캔버스 크기를 변경하면 발생하는 
     *    렌더링 부하를 방지하기 위해 최대 크기로 고정.
     * 2. 완료 후(Compact): 실제 다이어그램 크기에 맞춰 물리적 픽셀을 재조정하여 
     *    불필요한 메모리 점유를 최소화.
     */
    InitCapture(isExpand: 0 | 1) {
        const w = isExpand === 1 ? this.size.max.w : this.parent.w;
        const h = isExpand === 1 ? this.size.max.h : this.parent.h;
        
        // [Init] 캔버스 초기화 및 크기할당.
        this.cav.width = w * _DPR.value;
        this.cav.height = h * _DPR.value;

        // [Render] 좌표계 초기화 및 고해상도 설정.
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(_DPR.value, _DPR.value);
    }
}