
import { _DPR } from '@/main'
import { Square } from '@diagrams/core/square'


export class Capture {

    target: Square;
    cav: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    size = {
        min: {
            w: 96 as number,
            h: 96 as number,   
        },
        max: {
            w: 1024 as number,
            h: 1024 as number,   
        },
    };

    constructor(square: Square) {
        this.target = square;
        this.cav = document.createElement('canvas');
        this.ctx = this.cav.getContext('2d') as CanvasRenderingContext2D;
    }

    /**
     * [Function] InitCapture
     * @param isExpand 0:compact, 1:expand
     * @description [Optimize] 캡처용 캔버스 해상도 최적화 및 리사이징
     * * [1:Expand] 리사이징 시작 전(PanStart 이벤트): 매 프레임 캔버스 크기를 변경하면 발생하는 
        렌더링 부하를 방지하기 위해 최대 크기로 고정. 
     * * [0:Compact] 리사이징 완료 후(PanEnd 이벤트): 실제 다이어그램 크기에 맞춰 물리적 픽셀을 재조정하여 
        불필요한 메모리 점유를 최소화.
     */
    InitCapture(isExpand: 0 | 1) {
        let w: number;
        let h: number;

        // [Filter] 최대/최소 사이즈 판단.
        if(isExpand === 1) {
            w = this.size.max.w;
            h = this.size.max.h;
        }
        else {
            w = this.target.w;
            h = this.target.h;

            if(w < this.size.min.w) {w = this.size.min.w;}
            if(w > this.size.max.w) {w = this.size.max.w;}
            
            if(h < this.size.min.h) {h = this.size.min.h;}
            if(h > this.size.max.h) {h = this.size.max.h;}
        }
        
        // [Init] 캔버스 초기화 및 크기할당.
        this.cav.width = w * _DPR.value;
        this.cav.height = h * _DPR.value;

        // [Render] 좌표계 초기화 및 고해상도 설정.
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(_DPR.value, _DPR.value);
    }
}