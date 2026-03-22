
import { _DPR } from '../main'
import * as DiagramsType from '../diagrams/diagrams.type'

export class ViewBoard {

    private cav: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(args: {parentNode: HTMLDivElement}) {
        // [Create] 보드 캔버스 생성.
        this.cav = document.createElement('canvas');
        this.ctx = this.cav.getContext('2d') as CanvasRenderingContext2D;
        this.cav.id = 'board';
        args.parentNode.appendChild(this.cav);


    }

    Resize(w: number, h: number): void {
        const dpr = _DPR.value;
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

    Draw(x: number, y: number, list: DiagramsType.Instance[]) {
        const w = this.cav.width;
        const h = this.cav.height;
        
        this.ctx.clearRect(x-w/2, y-h/2, w, h);
        
        for(const diagram of list) {
            diagram.Draw(this.ctx);
        }

        this.Pointer(0,0,'green');
        this.Pointer(-w/2,-h/2,'orange');
        this.Pointer(-w/4,-h/4,'pink');
        this.Pointer(-w/4,0,'blue');
        this.Pointer(-w,0,'silver');

        this.Pointer(w,h,'skyblue');
        this.Pointer(w,-h/2,'purple');
    }

    Pointer(x: number, y: number, color: string) {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = color;
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.font = "16px Arial"; 
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`(${x}, ${y})`,x,y+30);
        ctx.restore();
    }
}