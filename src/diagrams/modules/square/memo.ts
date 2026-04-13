
import { _DPR } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'
import { Square } from '@/diagrams/core/square'

export class Memo extends Square implements DiagramsType.serialize.modules.square.Memo {
    memo = {
        backgroundColor : 'orange',
        text            : '',
    };

    constructor() {
        super();
        this.axis.type = 'Memo';
    }

    get serialize(): DiagramsType.serialize.modules.square.Memo {
        return {
            ...super.serialize,
            memo: {
                backgroundColor : this.memo.backgroundColor,
                text            : this.memo.text,
            },
        };
    }

    Snapshot() {
        const ctx = this.capture.ctx;
        const fontSize = 16;
        const guideLine = {x:20, y:20}
        
        ctx.clearRect(0, 0, this.w, this.h);
        
        ctx.save();
        ctx.fillStyle = this.memo.backgroundColor;
        ctx.fillRect(0, 0, this.w, this.h);

        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'top';
        
        ctx.fillText(`${this.memo.text}`, guideLine.x, guideLine.y);
        ctx.restore();
    }
}
