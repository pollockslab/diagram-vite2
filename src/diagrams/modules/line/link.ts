
import { _DPR } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'
import { Line } from '@/diagrams/core/line'

export class Link extends Line implements DiagramsType.serialize.modules.line.Link {
    link = {
        backgroundColor : 'orange',
        text            : '',
    };
    animation = {
        dach: {
            count: 0,
        },
    };

    constructor() {
        super();
        this.axis.type = 'Link';
    }

    get serialize(): DiagramsType.serialize.modules.line.Link {
        return {
            ...super.serialize,
            link: {
                backgroundColor : this.link.backgroundColor,
                text            : this.link.text,
            },
        };
    }

    Draw(ctx: CanvasRenderingContext2D) {
        this.DrawAnimation(ctx, this.x1, this.y1, this.x2, this.y2, null, null);
    }

    DrawAnimation(
        ctx: CanvasRenderingContext2D, 
        x1: number, y1: number, x2: number, y2: number,
        color: string|null, lineWidth: number|null
    ) {
        ctx.save();

        // 1. 기본 스타일 설정.
        ctx.strokeStyle = color ?? 'black';
        ctx.lineWidth   = lineWidth ?? 2;
        ctx.lineCap     = 'round';  // 선 끝 모양. (butt, round, square)
        ctx.lineJoin    = 'round'; // 선 꺾이는 부분 모양.

        // 2. 점선 설정.
        // 예: [8, 4] -> 8px 그리기, 4px 건너뛰기.
        // [Example] ctx.setLineDash([15, 3, 3, 3]); // 긴 선 (공백) 짧은 점 (공백) 
        ctx.setLineDash([8, 4]);

        // 3. 점선 애니메이션. (선택사항.)
        // (루프에서 0~점선길이 변경시 움직임.)
        ctx.lineDashOffset = 0;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.restore();
    }
}
