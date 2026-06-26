import { _DPR, _SNAP } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'
import { Axis } from '@/diagrams/core/axis'


export class Square extends Axis implements DiagramsType.serialize.core.Square {
    square = {
        x: 0 as number,
        y: 0 as number,
        w: 100 as number,
        h: 100 as number,
    };
    imageBitmap: null | ImageBitmap = null;

    constructor() {super();}

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
        if(size < 100) {
            this.square.w = 100;
        } 
        else if(size > 1000) {
            this.square.w = 1000;
        }
        else {
            this.square.w = size;
        }
    }
    
    get h() {
        return this.square.h;
    }
    set h(size) {
        if(size < 100) {
            this.square.h = 100;
        } 
        else if(size > 1000) {
            this.square.h = 1000;
        }
        else {
            this.square.h = size;
        }
    }

    Init() {
        this.Snapshot();
    }
    
    async Snapshot() {
        const ctx = _SNAP.ctx;
        ctx.clearRect(0, 0, this.w, this.h);

        ctx.save();

        // [Shadow]
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // [Panel]
        ctx.fillStyle = 'orange';
        ctx.fillRect(4, 4, this.w-8, this.h-8);
        ctx.restore();

        // [Copy]
        this.imageBitmap = await _SNAP.CreateBitmap(0, 0, this.w*_DPR.value, this.h*_DPR.value);
    }
    
    Draw(ctx: CanvasRenderingContext2D) {
        if(!this.imageBitmap) {return;}
        
        ctx.drawImage(
            this.imageBitmap,
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

