import { _DPR, _SNAP } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'
import { Axis } from '@/diagrams/core/axis'


export class Square extends Axis implements DiagramsType.serialize.core.Square {
    square = {
        left    :   0 as number,
        top     :   0 as number,
        width   : 100 as number,
        height  : 100 as number,
    };
    imageBitmap: null | ImageBitmap = null;

    constructor() {super();}

    get serialize(): DiagramsType.serialize.core.Square {
        return {
            ...super.serialize,
            square: {
                left    : this.left,
                top     : this.top,
                width   : this.width,
                height  : this.height,
            } 
        };
    }

    get left() {
        return this.square.left;
    }
    set left(size: number) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.square.left = (!Number.isFinite(size))? 0 : size;
    }

    get top() {
        return this.square.top;
    }
    set top(size) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.square.top = (!Number.isFinite(size))? 0 : size;
    }

    get width() {
        return this.square.width;
    }
    set width(size: number) {
        if(size < 100) {
            this.square.width = 100;
        } 
        else if(size > 1000) {
            this.square.width = 1000;
        }
        else {
            this.square.width = size;
        }
    }
    
    get height() {
        return this.square.height;
    }
    set height(size: number) {
        if(size < 100) {
            this.square.height = 100;
        } 
        else if(size > 1000) {
            this.square.height = 1000;
        }
        else {
            this.square.height = size;
        }
    }

    Init() {
        this.Snapshot();
    }
    
    async Snapshot() {
        const ctx = _SNAP.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        ctx.save();

        // [Shadow]
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // [Panel]
        ctx.fillStyle = 'orange';
        ctx.fillRect(4, 4, this.width-8, this.height-8);
        ctx.restore();

        // [Copy]
        this.imageBitmap = await _SNAP.CreateBitmap(
            0, 0, this.width*_DPR.value, this.height*_DPR.value);
    }
    
    Draw(ctx: CanvasRenderingContext2D) {
        if(!this.imageBitmap) {return;}
        
        ctx.drawImage(
            this.imageBitmap,
            0, 
            0, 
            this.width*_DPR.value, 
            this.height*_DPR.value,
            this.left, 
            this.top, 
            this.width, 
            this.height,
        );
    }
}

