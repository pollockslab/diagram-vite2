
import { _DPR, _SPCE } from '../main'
import { View } from './view'
import * as DiagramsType from '@/diagrams/diagrams.type'

export class ViewBoard {
    constructor(public readonly parent: View) {}
    
    Draw(diagrams: DiagramsType.Instance[]) {
        const {ctx} = this.parent;
        for(const diagram of diagrams) {
            diagram.Draw(ctx);
        }
    }
}