import { _DPR, _SNAP } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'
import { Axis } from '@/diagrams/core/axis'


export class Rect extends Axis {
    rect = {
        left    :   0 as number,
        top     :   0 as number,
        width   : 100 as number,
        height  : 100 as number,
    };
    imageBitmap: null | ImageBitmap = null;

    constructor() {super();}

    static get origin(): DiagramsType.serialize.core.Rect {
        return {
            ...super.origin,
            rect: {
                left    : 0,
                top     : 0,
                width   : 100,
                height  : 100,
            },
        };
    }
    get serialize(): DiagramsType.serialize.core.Rect {
        return {
            ...super.serialize,
            rect: {
                left    : this.left,
                top     : this.top,
                width   : this.width,
                height  : this.height,
            },
        };
    }
    set serialize(data: DiagramsType.serialize.core.Rect) {
        // [Axis]
        super.serialize = data; 

        // [Rect]
        this.left      = data.rect.left;
        this.top       = data.rect.top;
        this.width     = data.rect.width;
        this.height    = data.rect.height;
    }

    get left() {
        return this.rect.left;
    }
    set left(size: number) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.rect.left = (!Number.isFinite(size))? 0 : size;
    }

    get top() {
        return this.rect.top;
    }
    set top(size) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.rect.top = (!Number.isFinite(size))? 0 : size;
    }

    get width() {
        return this.rect.width;
    }
    set width(size: number) {
        if(size < 100) {
            this.rect.width = 100;
        } 
        else if(size > 1000) {
            this.rect.width = 1000;
        }
        else {
            this.rect.width = size;
        }
    }
    
    get height() {
        return this.rect.height;
    }
    set height(size: number) {
        if(size < 100) {
            this.rect.height = 100;
        } 
        else if(size > 1000) {
            this.rect.height = 1000;
        }
        else {
            this.rect.height = size;
        }
    }

    Init() {
        this.Snapshot();
    }
    
    GetAnchorPoints(_width?: number, _height?: number): {x: number, y: number}[] {
        if(typeof _width !== 'number' || typeof _height !== 'number') {
            return [];
        }
        const list: {x: number, y: number}[] = [];
        for(let col=this.left; col<this.left+this.width; col+=_width) {
            for(let row=this.top; row<this.top+this.height; row+=_height) {
                const floorX = Math.floor(col/_width)*_width;
                const floorY = Math.floor(row/_height)*_height;
                list.push({x: floorX, y: floorY});
            }
        }
        return list;
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

