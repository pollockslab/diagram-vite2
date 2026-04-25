
import { _DPR } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'
import { Square } from '@/diagrams/core/square'

export class Drawmap extends Square implements DiagramsType.serialize.modules.square.Drawmap {
    drawmap = {
        backgroundColor : 'orange',
        text            : '',
    };

    constructor(args: Partial<any> = {}) {
        super();
        this.SetData(args);
        this.axis.type = 'Drawmap';
    }

    get serialize(): DiagramsType.serialize.modules.square.Drawmap {
        return {
            ...super.serialize,
            drawmap: {
                backgroundColor : this.drawmap.backgroundColor,
                text            : this.drawmap.text,
            },
        };
    }

    Snapshot() {
        const ctx = this.capture.ctx;
        const x = 0;
        const y = 0;
        const fontSize = 16;
        const guideLine = {x:20, y:20}
        
        ctx.clearRect(x, y, this.w, this.h);
        
        ctx.save();
        ctx.fillStyle = this.drawmap.backgroundColor;
        ctx.fillRect(x, y, this.w, this.h);

        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'top';
        
        ctx.fillText(`${this.drawmap.text}`, x+guideLine.x, y+guideLine.y);
        ctx.restore();
    }
}
