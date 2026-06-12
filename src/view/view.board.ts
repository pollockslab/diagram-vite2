
import { _DPR, _SPCE } from '../main'

export class ViewBoard {
    constructor() {}
    
    Draw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        const find = _SPCE.collision.Square(x-w/2, y-h/2, w, h);
        for(const diagram of find) {
            diagram.Draw(ctx);
        }
    }
}