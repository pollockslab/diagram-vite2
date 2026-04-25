import { _DPR } from '@/main'
import * as DiagramsType from '../diagrams.type'
import { Axis } from './axis'

export class Point extends Axis implements DiagramsType.serialize.core.Point {
    point = {
        x       : 0 as number,
        y       : 0 as number,
    };

    constructor(args: Partial<any> = {}) 
    {
        super();
        this.SetData(args);
        this.axis.type = 'Point';
    }

    get serialize(): DiagramsType.serialize.core.Point
    {
        return {
            ...super.serialize,
            point: {
                x: this.point.x,
                y: this.point.y,
            },
        };
    }

    get x() {
        return this.point.x;
    }
    set x(size) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.point.x = (!Number.isFinite(size))? 0 : size;
    }

    get y() {
        return this.point.y;
    }
    set y(size) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.point.y = (!Number.isFinite(size))? 0 : size;
    }
    
    Draw(ctx: CanvasRenderingContext2D) {

        // [Point] x, y 좌표에 점 그리기.
        this.DrawPoint(ctx, this.x, this.y, 10, null);

        // [Text] 포인트 밑에 '(x, y)' 좌표 텍스트 그리기.
        this.DrawText(ctx, this.x, this.y, null, null);
    }
    
    DrawPoint(ctx:CanvasRenderingContext2D, x: number, y: number, radius: number, color: null|string) {
        ctx.save();
        ctx.fillStyle = color ?? 'black';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    DrawText(ctx:CanvasRenderingContext2D, x: number, y: number, font: null|string, color: null|string) {
        ctx.save();
        ctx.fillStyle = color ?? 'white';
        ctx.font = font ?? "16px Arial"; 
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`(${x}, ${y})`,x, y+30);
        ctx.restore();
    }
}
