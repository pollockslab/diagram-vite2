import { _DPR } from '@/main'
import * as DiagramsType from '../diagrams.type'
import { Axis } from './axis'

export class Line extends Axis implements DiagramsType.serialize.core.Line {
    line = {
        a: {    
            x: 0 as number,
            y: 0 as number, 
        },
        b: {    
            x: 0 as number,
            y: 0 as number, 
        },
    };
    
    constructor() {super();}

    get serialize(): DiagramsType.serialize.core.Line {
        return {
            ...super.serialize,
            line: {
                a: {
                    x: this.aX,
                    y: this.aY,
                },
                b: {
                    x: this.bX,
                    y: this.bY,
                },
            } 
        };
    }

    get aX() {
        return this.line.a.x;
    }
    set aX(size) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.line.a.x = (!Number.isFinite(size))? 0 : size;
    }

    get aY() {
        return this.line.a.y;
    }
    set aY(size) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.line.a.y = (!Number.isFinite(size))? 0 : size;
    }

    get bX() {
        return this.line.b.x;
    }
    set bX(size) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.line.b.x = (!Number.isFinite(size))? 0 : size;
    }

    get bY() {
        return this.line.b.y;
    }
    set bY(size) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.line.b.y = (!Number.isFinite(size))? 0 : size;
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
