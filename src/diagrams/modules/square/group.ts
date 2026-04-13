
import { _DPR } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'
import { Square } from '@/diagrams/core/square'

export class Group extends Square implements DiagramsType.serialize.modules.square.Group {
    group = {
        backgroundColor : 'orange',
        text            : '',
    };

    constructor() {
        super();
        this.axis.type = 'Group';
    }

    get serialize(): DiagramsType.serialize.modules.square.Group {
        return {
            ...super.serialize,
            group: {
                backgroundColor : this.group.backgroundColor,
                text            : this.group.text,
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
        ctx.fillStyle = this.group.backgroundColor;
        ctx.fillRect(x, y, this.w, this.h);

        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'top';
        
        ctx.fillText(`${this.group.text}`, x+guideLine.x, y+guideLine.y);
        ctx.restore();
    }
}
