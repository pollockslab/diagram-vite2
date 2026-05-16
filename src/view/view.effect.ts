
import { _DPR, _CTRL, _VIEW } from '@/main'
import * as diagramsType from '@/diagrams/diagrams.type'
import * as ViewType from './view.type'

export class ViewEffect {

    private cav: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    list = {
        square : [] as ViewType.EffectSquare[],
    }
    map = new Map<string, ViewType.EffectSquare>();

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

    Draw(viewX: number, viewY: number) {
        
        const cavW = this.cav.width;
        const cavH = this.cav.height;
        
        this.ctx.clearRect(viewX-cavW/2, viewY-cavH/2, cavW, cavH);
        this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
        this.ctx.fillRect(viewX-cavW/2+10, viewY-cavH/2+10, cavW-20, cavH-20);
        // this.AddSquare(-40, -30, 100, 100, 'skyblue');
        

        for (const [key, item] of this.map) {
            // key 타입을 정해보자.
            // 점, 라인, 사각형(보더, 렉트)
            // *추가로 hover 인지 drag인지
            // 분류해서 나열해봐

            // 필요한 키
           
            switch(key) {
                case 'drag-border': {
                    const { x, y, w, h, color } = item;
                    this.DrawBorder(x, y, w, h, color);
                    break;
                }
                case 'drag-square': {
                    const { x, y, w, h, color } = item;
                    this.DrawSquare(x, y, w, h, color);
                    break;
                }
            }
            
        }

        
        this.map.clear();
    }

    AddBorder(x: number, y: number, w: number, h: number, color: string) {  
         this.map.set('drag-border', {x, y, w, h, color});  
    }
    AddSquare(x: number, y: number, w: number, h: number, color: string) {  
         this.map.set('drag-square', {x, y, w, h, color});  
    }

    DrawBorder(x: number, y: number, w: number, h: number, color: string) {
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(x, y, w, h);
        this.ctx.restore();
    }

    DrawSquare(x: number, y: number, w: number, h: number, color: string) {
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
        this.ctx.restore();
    }
}