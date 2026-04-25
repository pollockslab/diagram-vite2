
import { _DPR } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'
import { Square } from '@/diagrams/core/square'

export class Action extends Square implements DiagramsType.serialize.modules.button.Action {
    action = {
        backgroundColor : 'orange',
        text            : '',
        call            : '',
        imageSrc        : '',
    };

    constructor(args: Partial<any> = {}) {
        super();
        this.SetData(args);
        this.axis.type = 'Action';
    }

    get serialize(): DiagramsType.serialize.modules.button.Action {
        return {
            ...super.serialize,
            action: {
                backgroundColor: this.action.backgroundColor,
                text: this.action.text,
                call: this.action.call,
                imageSrc: this.action.imageSrc,
            } 
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
        ctx.fillStyle = this.action.backgroundColor;
        ctx.fillRect(x, y, this.w, this.h);

        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'top';
        
        ctx.fillText(`${this.action.text}`, x+guideLine.x, y+guideLine.y);
        ctx.restore();
    }
}
