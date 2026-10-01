import { _DPR, _SNAP } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'
import { Axis } from '@/diagrams/core/axis'


export class Rect extends Axis {
    rect = {
        x       :   0 as number,
        y       :   0 as number,
        width   : 100 as number,
        height  : 100 as number,
    };
    imageBitmap: null | ImageBitmap = null;

    constructor() {super();}

    static get origin(): DiagramsType.serialize.core.Rect {
        return {
            ...super.origin,
            rect: {
                x       : 0,
                y       : 0,
                width   : 100,
                height  : 100,
            },
        };
    }
    get serialize(): DiagramsType.serialize.core.Rect {
        return {
            ...super.serialize,
            rect: {
                x       : this.left,
                y       : this.top,
                width   : this.width,
                height  : this.height,
            },
        };
    }
    set serialize(data: DiagramsType.serialize.core.Rect) {
        // [Axis]
        super.serialize = data; 

        // [Rect]
        this.x          = data.rect.x;
        this.y          = data.rect.y;
        this.width     = data.rect.width;
        this.height    = data.rect.height;
    }
    get x(): number {
        return this.rect.x;
    }
    set x(data: number) {
        // [Validation] NaN, Infinity 등 비정상 숫자는 무시하고 이전 값 유지
        if (!Number.isFinite(data)) {
            console.warn('Invalid x:', data);
            return;
        }
        this.rect.x = data;
    }
    get y(): number {
        return this.rect.y;
    }
    set y(data: number) {
        // [Validation] NaN, Infinity 등 비정상 숫자는 무시하고 이전 값 유지
        if (!Number.isFinite(data)) {
            console.warn('Invalid y:', data);
            return;
        }
        this.rect.y = data;
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

    get left    () {return this.rect.x - this.width /2;}
    get top     () {return this.rect.y - this.height/2;}
    get right   () {return this.rect.x + this.width /2;}
    get bottom  () {return this.rect.y + this.height/2;}

    Init() {
        this.Snapshot();
    }

    GetRect(): {
        left : number, top   : number, 
        right: number, bottom: number, 
        width: number, height: number, 
    } {
        return {
            left : this.left , top   : this.top   ,
            right: this.right, bottom: this.bottom, 
            width: this.width, height: this.height, 
        };
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

