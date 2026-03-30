
import { _DPR } from '@/main'
import * as DiagramsType from '@diagrams/diagrams.type'
import { Line } from '@diagrams/core/line'

export class Arrow extends Line implements DiagramsType.serialize.modules.line.Arrow {
    arrow = {
        backgroundColor : 'orange',
        text            : '',
    };

    constructor() {
        super();
        this.axis.type = 'Arrow';
    }

    get serialize(): DiagramsType.serialize.modules.line.Arrow {
        return {
            ...super.serialize,
            arrow: {
                backgroundColor : this.arrow.backgroundColor,
                text            : this.arrow.text,
            },
        };
    }

    Draw(ctx: CanvasRenderingContext2D) {
        this.DrawLine(ctx, this.x1, this.y1, this.x2, this.y2, null, null);
        this.DrawArrow(ctx, this.x1, this.y1, this.x2, this.y2, 10);
    }

    private DrawArrow(
        ctx: CanvasRenderingContext2D, 
        x1: number, y1: number, x2: number, y2: number,
        size: number
    ) {
        const angle = Math.atan2(y2 - y1, x2 - x1);

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(
            x2 - size * Math.cos(angle - Math.PI / 6),
            y2 - size * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            x2 - size * Math.cos(angle + Math.PI / 6),
            y2 - size * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill(); 
    }
}
