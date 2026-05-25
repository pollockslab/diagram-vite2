
import { _DPR, _SPCE } from '../main'

export class ViewBoard {
    constructor() {}
    //  list: DiagramsType.Instance[]
    Draw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        const children = _SPCE.SelectArea(x-w/2, y-h/2, w, h);
        for(const diagram of children) {
            diagram.Draw(ctx);
        }
    }
}