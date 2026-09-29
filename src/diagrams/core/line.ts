import { _DPR } from '@/main'
import * as DiagramsType from '../diagrams.type'
import { Axis } from './axis'

export class Line extends Axis {
    line = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
    };
    
    constructor() {super();}

    static get origin(): DiagramsType.serialize.core.Line {
        return {
            ...super.origin,
            line: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
            },
        };
    }
    get serialize(): DiagramsType.serialize.core.Line {
        return {
            ...super.serialize,
            line: {
                x1: this.x1,
                y1: this.y1,
                x2: this.x2,
                y2: this.y2,
            },
        };
    }
    set serialize(data: DiagramsType.serialize.core.Line) {
        // [Axis]
        super.serialize = data;

        // [Line]
        this.x1 = data.line.x1;
        this.y1 = data.line.y1;
        this.x2 = data.line.x2;
        this.y2 = data.line.y2;
    }

    get x1() {
        return this.line.x1;
    }
    set x1(size) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.line.x1 = (!Number.isFinite(size))? 0 : size;
    }

    get y1() {
        return this.line.y1;
    }
    set y1(size) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.line.y1 = (!Number.isFinite(size))? 0 : size;
    }

    get x2() {
        return this.line.x2;
    }
    set x2(size) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.line.x2 = (!Number.isFinite(size))? 0 : size;
    }

    get y2() {
        return this.line.y2;
    }
    set y2(size) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.line.y2 = (!Number.isFinite(size))? 0 : size;
    }

    GetAnchorPoints(_width?: number, _height?: number): {x: number, y: number}[] {
        if(typeof _width !== 'number' || typeof _height !== 'number') {
            return [];
        }
        // 기울기
        const startX = Math.min(this.x1, this.x2);
        const endX = Math.max(this.x1, this.x2);
        
        const fx = (x: number) => {
            const gradient = (this.y2-this.y1)/(this.x2-this.x1);
            return (x-startX)*gradient;
        }

        const list: {x: number, y: number}[] = [];
        // line 은 기울기고, w,h를 동시에 만족시킬수 없어
        for(let col=startX; col<endX; col+=_width) {
            const floorX = Math.floor(col/_width)*_width;
            const floorY = Math.floor(fx(col)/_height)*_height;

            list.push({x: floorX, y: floorY});
        }
        return list;
    }
    
    Draw(ctx: CanvasRenderingContext2D) {
        this.DrawLine(ctx, this.x1, this.y1, this.x2, this.y2, null, null);
    }

    DrawLine(
        ctx: CanvasRenderingContext2D, 
        x1: number, y1: number, x2: number, y2: number,
        color: string|null, lineWidth: number|null
    ) {
        ctx.save();
        ctx.strokeStyle = color ?? 'black';
        ctx.lineWidth   = lineWidth ?? 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    }
    
}
