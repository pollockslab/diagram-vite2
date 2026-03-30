
import { _DPR, _CTRL, _VIEW } from '@/main'
import * as diagramsType from '@diagrams/diagrams.type'

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
            this.DrawBorder(hover, 'skyblue');
        }

        for(let s=0; s<selects.length; s++) {
            this.DrawBorder(selects[s], 'lightgreen');
        }
        
        ///////////////////////////////////////
        // [Test] hover된 그리드 셀에 Border 적용
        function SnapToGrid(value: number): number {
            const size = 100;
            return Math.floor(value / size) * size;
        }
        
        const x1 = SnapToGrid(_VIEW.SpaceX(_CTRL.hover.offsetX));
        const y1 = SnapToGrid(_VIEW.SpaceY(_CTRL.hover.offsetY));
        

        this.ctx.strokeStyle = 'silver';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x1, y1, 100, 100);
        
        // 목표1. 해당 칸만 콜리전체크 하도록 만든다
        // 목표2. 다이어그램 최대크기 고려해서 그리드 범위만큼 콜리전체크로 바꾸기
    }

    DrawBorder(diagram: diagramsType.Instance, color: string) {
        // console.log(diagram, color);
        const {x, y, w, h} = diagram;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 6;
        this.ctx.strokeRect(x, y, w, h);
    }
}