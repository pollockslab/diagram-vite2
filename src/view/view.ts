import { _DIAGRAM } from '../imports'

interface IDiagram {
    type: string,
    [key: string]: any
}

interface ChildrenStructure {
    none: IDiagram[];
    point: IDiagram[];
    square: IDiagram[];
    line: IDiagram[];
    button: IDiagram[];
}
interface Layer {
    cav: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
}


export class _MAIN 
{
    parentNode: HTMLElement;
    scope = {
        min:0.5, max:2, zoom:1, w:0, h:0,
        dpr: Math.round(window.devicePixelRatio) || 1,
        backgroundTileStep: 100,
    };
    x=0;
    y=0;
    // 초기값 할당 및 타입 지정
    children: ChildrenStructure = {
        none: [],
        point: [],
        square: [],
        line: [],
        button: [],
    };
    isDragging = false;
    isResizing = false;

    layers: { [key: string]: { cav: HTMLCanvasElement, ctx: CanvasRenderingContext2D } } = {};
    
    constructor(args: Partial<_MAIN> = {})
    {
        this.parentNode = args.parentNode || document.body;

        this.InitLayers();

        window.addEventListener('resize', (e) => { this.Resize(); });
        this.Resize();

        this.Loop();
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

    Loop = () =>
    {
        if(this.isDragging || this.isResizing) {
            this.Draw();
            this.isDragging = false;
            this.isResizing = false;
        }
        requestAnimationFrame(this.Loop);
    }

    InitLayers()
    {
        // ['background', 'board', 'effect'].forEach(name => {
        ['background'].forEach(name => {
            const cav = document.createElement('canvas');
            const ctx = cav.getContext('2d')!; // !는 "무조건 있어"라는 뜻
            cav.style = 'position:absolute; width:100%; height:100%;';
            this.parentNode.appendChild(cav);

            this.layers[name] = { cav, ctx };
        });
    }

    Resize()
    {
        this.scope.w = window.innerWidth;
        this.scope.h = window.innerHeight;

        Object.values(this.layers).forEach(layer => 
        {
            layer.cav.width = this.scope.w * this.scope.dpr;
            layer.cav.height = this.scope.h * this.scope.dpr;
        });
        
        this.isResizing = true;
    }

    SpaceLine(pixel:number)
    {
        return pixel / this.zoom;
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
        // this.AddChild({type:'square', x:0, y: 0, w:200, h:300, bgColor:'blue'});
        // this.AddChild({type:'square', x:-100, y: -400, w:300, h:300, bgColor:'orange'});

        this.isResizing = true;
    }

    AddChild(args:IDiagram)
    {
        if(typeof args.type !== 'string') {return;}
        
        let diagram;
        switch(args.type) 
        {
            case 'square':
                diagram = new _DIAGRAM.square(args);
                this.children.square.push(diagram);
                break;
        }
    }

    FindByID(diagramID: string): IDiagram | null 
    {
        // key를 꺼내서 접근할 때 TS 에러를 피하려면 Object.keys 대신 values가 속 편합니다.
        const allLists = Object.values(this.children);

        for (const list of allLists) {
            const found = list.find((item:IDiagram) => item.id === diagramID);
            if (found) return found;
        }
        return null;
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
    }

    DrawBackground()
    {
        if(!this.layers.background) return;
        if(this.scope.zoom < 0.5) return;
        const ctx = this.layers.background.ctx;
        const step = this.scope.backgroundTileStep;
        const w = this.SpaceLine(this.scope.w);
        const h = this.SpaceLine(this.scope.h);
        const line = (w>h)? w:h;
        const x = this.x - line/2 - this.x%step;
        const y = this.y - line/2 - this.y%step;
        
        ctx.save();
        ctx.strokeStyle = 'rgb(54,63,63)';
        ctx.beginPath();

        const addr = step;

        // 중앙->우
        for(let i=x-addr; i<line+x+addr; i+=step) 
        {
            ctx.moveTo(i-addr       , y-addr);
            ctx.lineTo(i+addr+line  , y+addr+line);

            ctx.moveTo(i-addr       , y+addr+line);
            ctx.lineTo(i+addr+line  , y-addr     );
        }

        // 중앙->좌
        for(let i=x+addr; i>-line+x-addr; i-=step) 
        {
            ctx.moveTo(i-addr       , y-addr);
            ctx.lineTo(i+addr+line  , y+addr+line);

            ctx.moveTo(i-addr       , y+addr+line);
            ctx.lineTo(i+addr+line  , y-addr     );
        }
        
        ctx.stroke();
        ctx.restore();
    }
    // DrawBackground() {
    //     if (!this.layers.background) return;
    //     const ctx = this.layers.background.ctx;
    //     const step = this.scope.backgroundTileStep;
        
    //     // 현재 화면의 가시 영역 계산
    //     const w = this.scope.w / this.zoom;
    //     const h = this.scope.h / this.zoom;
        
    //     // 시작점과 끝점 계산 (화면 밖으로 조금 더 여유있게)
    //     const startX = this.x - w / 2 - (this.x % step) - step;
    //     const endX = this.x + w / 2 + step;
    //     const startY = this.y - h / 2 - (this.y % step) - step;
    //     const endY = this.y + h / 2 + step;

    //     ctx.save();
    //     ctx.strokeStyle = 'rgb(54,63,63)';
    //     ctx.beginPath();

    //     // 격자무늬(Grid) 형태로 그리는 것이 훨씬 빠릅니다.
    //     // 세로선
    //     for (let i = startX; i < endX; i += step) {
    //         ctx.moveTo(i, startY);
    //         ctx.lineTo(i, endY);
    //     }
    //     // 가로선
    //     for (let j = startY; j < endY; j += step) {
    //         ctx.moveTo(startX, j);
    //         ctx.lineTo(endX, j);
    //     }

    //     ctx.stroke();
    //     ctx.restore();
    // }
}