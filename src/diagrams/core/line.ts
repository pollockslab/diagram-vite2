import { _DPR } from '@/main'
import * as DiagramsType from '../diagrams.type'
import { Axis } from './axis'

export class Line extends Axis implements DiagramsType.serialize.core.Line {
    line = {
        x1: 0 as number,
        y1: 0 as number,
        x2: 0 as number,
        y2: 0 as number,
    };

    constructor(args: Partial<any> = {}) 
    {
        super();
        this.SetData(args);
        this.axis.type = 'Line';
    }

    get serialize(): DiagramsType.serialize.core.Line {
        return {
            ...super.serialize,
            line: {
                x1: this.x1,
                y1: this.y1,
                x2: this.x2,
                y2: this.y2,
            } 
        };
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
