import { _DPR } from '@/main'
import * as DiagramsType from '@diagrams/diagrams.type'
import { Axis } from '@/diagrams/core/axis'
import { Capture } from './square.capture'

export class Square extends Axis implements DiagramsType.serialize.core.Square {
    square = {
        x: 0 as number,
        y: 0 as number,
        w: 100 as number,
        h: 100 as number,
    };
  
    capture = new Capture(this);

    constructor() {
        super();
        this.axis.type = 'Square';
        this.capture.InitCapture(0);
    }
    get serialize(): DiagramsType.serialize.core.Square {
        return {
            ...super.serialize,
            square: {
                x: this.x,
                y: this.y,
                w: this.w,
                h: this.h,
            } 
        };
    }

    get x() {
        return this.square.x;
    }
    set x(size) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.square.x = (!Number.isFinite(size))? 0 : size;
    }

    get y() {
        return this.square.y;
    }
    set y(size) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.square.y = (!Number.isFinite(size))? 0 : size;
    }

    get w() {
        return this.square.w;
    }
    set w(size) {
        if(100 <= size && size <= 1000) this.square.w = size;
    }
    
    get h() {
        return this.square.h;
    }
    set h(size) {
        if(100 <= size && size <= 1000) this.square.h = size;
    }
    
    Snapshot() {
        const ctx = this.capture.ctx;
        ctx.clearRect(0, 0, this.w, this.h);

        ctx.save();
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.w, this.h);
        ctx.restore();
    }
    
    Draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(
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
}
