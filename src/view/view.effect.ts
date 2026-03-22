
import { _DPR, _CTRL } from '@/main'
import * as diagramsType from '@diagrams/diagrams.type'

type EffectType = 'hover' | 'select';

export class ViewEffect {

    private cav: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(args: {parentNode: HTMLDivElement}) {
        // [Create] 이펙트 캔버스 생성.
        this.cav = document.createElement('canvas');
        this.ctx = this.cav.getContext('2d') as CanvasRenderingContext2D;
        this.cav.id = 'effect';
        args.parentNode.appendChild(this.cav);
        

    }

    Resize(w: number, h: number): void {
        const dpr = _DPR.value
        this.cav.width = w * dpr;
        this.cav.height = h * dpr;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    Update(x: number, y: number, zoom: number): void {
        const dpr = _DPR.value;
        const w = this.cav.width/dpr;
        const h = this.cav.height/dpr;

        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
       
        this.ctx.translate(w/2, h/2);
        this.ctx.scale(zoom, zoom); 
        this.ctx.translate(-x, -y);
    }

    Draw(x: number, y: number) {

        const w = this.cav.width;
        const h = this.cav.height;
        
        this.ctx.clearRect(x-w/2, y-h/2, w, h);

        const hover = _CTRL.hover.target;
        const selects = _CTRL.select.targets;

        if(hover) {
            this.DrawBorder(hover, 'red');
        }

        for(let s=0; s<selects.length; s++) {
            this.DrawBorder(selects[s], 'green');
        }
    }

    DrawBorder(diagram: diagramsType.Instance, color: string) {
        // console.log(diagram, color);
        const {x, y, w, h} = diagram;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, w, h);
    }
}