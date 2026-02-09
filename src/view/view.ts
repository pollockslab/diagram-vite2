import { _DIAGRAM } from '../imports'
import { _CTRL } from '../main'


export class _MAIN extends _DIAGRAM.axis
{
    parentNode: HTMLElement;
    scope = {
        min:0.5, max:2, zoom:1, w:0, h:0,
        dpr: Math.round(window.devicePixelRatio) || 1,
        bgStep: 100,
        bgPattern: null as CanvasPattern | null,
    };

    // 배경타일, 다이어그램, 선택표시 그릴 캔버스 레이어들
    layers: { [key: string]: { cav: HTMLCanvasElement, ctx: CanvasRenderingContext2D } } = {};

    status = {
        hover: null as Record<string, any> | null,
        select: [] as Record<string, any>[],
    }
    
    constructor(args: Partial<_MAIN> = {})
    {
        super();
        this.parentNode = args.parentNode || document.body;

        this.InitLayers();
    }
    
    get zoom()
    {
        return this.scope.zoom;
    }
    set zoom(size)
    {
        if(size >= this.scope.min && size <= this.scope.max) {
            this.scope.zoom = size;
        }
    }

    InitLayers()
    {
        ['background', 'board', 'effect'].forEach(name => {
            const cav = document.createElement('canvas');
            const ctx = cav.getContext('2d')!; // !는 "무조건 있어"라는 뜻
            cav.style = 'position:absolute; width:100%; height:100%;';
            this.parentNode.appendChild(cav);

            this.layers[name] = { cav, ctx };
        });
    }


    SpaceX(screenX: number): number 
    {
        const w = this.scope.w;
        const zoom = this.scope.zoom;
        
        // 계산 후 통째로 반올림
        const worldX = (screenX - (w / 2)) / zoom + this.x;
        return Math.round(worldX);
    }
    SpaceY(screenY: number): number 
    {
        const h = this.scope.h;
        const zoom = this.scope.zoom;
        
        const worldY = (screenY - (h / 2)) / zoom + this.y;
        return Math.round(worldY);
    }
    SpaceLine(pixel:number): number
    {
        return Math.round(pixel / this.zoom);
    }


    async LoadMap(id:string)
    {
        this.children = {
            none: [],
            point: [],
            square: [],
            line: [],
            button: [],
        };

        // 생성순서가 있으니 순서대로 하는게 맞을거같아
        this.AddChild({type:'square', x:0, y: 0, w:200, h:300, bgColor:'blue', id:id});
        this.AddChild({type:'square', x:-100, y: -400, w:300, h:300, bgColor:'orange'});

        _CTRL.loop.isDraw = true;
        _CTRL.Loop();
    }

    Draw()
    {
        // 1. clear canvas
        const w = this.scope.w;
        const h = this.scope.h;
        const dpr = this.scope.dpr;
        const zoom = this.scope.zoom

        Object.values(this.layers).forEach(layer => 
        {
            const ctx = layer.ctx;
            
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);
            ctx.translate(w/2, h/2);

            ctx.scale(zoom, zoom);
            ctx.translate(-this.x, -this.y);
        });

        // 2. draw background
        this.DrawBackground();

        // 3. draw diagram
        const types = ['none', 'point', 'square', 'line', 'button'] as const;
        types.forEach((dType) =>
        {
            const diagrams = this.children[dType];
            if(diagrams.length <= 0) {return;}
            for(const diagram of diagrams) {
                diagram.Draw(this.layers.board.ctx);
            }
        });

        const hover = this.status.hover;
        if(hover !== null) {
            hover.DrawHover(this.layers.effect.ctx);
        }
    }

    DrawBackground() 
    {
        if (!this.layers.background) return;
        const ctx = this.layers.background.ctx;
        const step = this.scope.bgStep;
        const { w, h, dpr, zoom } = this.scope;

        if (!this.scope.bgPattern) {
            const pCav = document.createElement('canvas');
            pCav.width = step; 
            pCav.height = step;
            const pCtx = pCav.getContext('2d')!;
            pCtx.strokeStyle = 'rgb(54,63,63)';
            pCtx.beginPath();
            pCtx.moveTo(0, 0); pCtx.lineTo(step, step);
            pCtx.moveTo(step, 0); pCtx.lineTo(0, step);
            pCtx.stroke();
            this.scope.bgPattern = ctx.createPattern(pCav, 'repeat');
        }

        if (this.scope.bgPattern) {

            ctx.save();
            
            // 1. 먼저 배경 캔버스도 다른 캔버스와 똑같이 dpr을 세팅합니다.
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);

            // 2. 패턴 매트릭스에는 오직 가상 좌표와 줌만 계산합니다. (dpr 제외)
            const matrix = new DOMMatrix();
            matrix.translateSelf(w / 2, h / 2); // 물리 dpr 곱하지 않음
            matrix.scaleSelf(zoom, zoom);
            matrix.translateSelf(-this.x, -this.y);
            
            this.scope.bgPattern.setTransform(matrix);

            // 3. 칠하기
            ctx.fillStyle = this.scope.bgPattern as CanvasPattern;
            ctx.fillRect(0, 0, w, h); 
            
            ctx.restore();
        }
    }
    
}