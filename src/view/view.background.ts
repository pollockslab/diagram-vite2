
import { _DPR } from '../main'
import * as ViewType from './view.type'

/**
 * [Class] ViewBackground
 * @description 
 * 메인 캔버스 하단에 위치하는 배경 렌더링 엔진.
 * - [Lightweight] 성능 최적화를 위해 DPR을 1.0으로 고정.
 * - [Recycle] DOMMatrix를 재사용하여 메모리 부하 방지.
 * - [Optimize] 배경 패턴을 미리 생성하여 저장해두고,
        매 프레임(Draw)마다 계산 없이 저장된 스타일만 적용하여 부하를 최소화 함.
 */
export class ViewBackground {

    private cav: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private pattern: ViewType.Pattern.Class = null;

    constructor(args: {parentNode: HTMLDivElement}) { 
        // [Create] 백그라운드 캔버스 생성.
        this.cav = document.createElement('canvas');
        this.ctx = this.cav.getContext('2d') as CanvasRenderingContext2D;
        this.cav.id = 'background';
        args.parentNode.appendChild(this.cav);

        // [Config] 기본패턴 설정.
        this.Pattern('grid');
        // this.Pattern('rhombus');
        // this.Pattern('dot3');
    }

    /**
     * [Function] Pattern
     * @param type 타일명칭.(예: null, 'dot3', 'rhombus')
     * @description 배경 패턴을 선택한다.
     */
    Pattern(type: ViewType.Pattern.String): void {
        switch(type) {
            case 'dot3':
                this.pattern = new Dot3();        
                break;
            case 'rhombus':
                this.pattern = new Rhombus();        
                break;
            case 'grid':
                this.pattern = new Grid();        
                break;
            case null: 
            default:
                this.pattern = null;
                break;
        }
    }

    Resize(w: number, h: number): void {
        // [Lightweight] 배경 해상도를 1.0으로 고정하여 최적화.
        const dpr = 1; // _DPR.value
        this.cav.width = w * dpr;
        this.cav.height = h * dpr;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    Update(x: number, y: number, zoom: number): void {
        this.pattern?.Update(x, y, this.cav.width, this.cav.height, zoom);
    }

    Draw(): void {
        this.pattern?.Draw(this.cav.width, this.cav.height, this.ctx);
    }
}

/**
 * [Function] UpdatePattern
 * @description  패턴 위치를 맵 이동에 맞게 재설정합니다.
 * @param x 맵 이동축 좌표 x
 * @param y 맵 이동축 좌표 y
 * @param w 맵 넓이 w
 * @param h 맵 넓이 h
 * @param zoom 맵 zoom 사이즈
 * @param matrix 패턴위치 설정용 matrix
 * @param style 패턴 저장소
 */
function UpdatePattern(x: number, y: number, w: number, h: number, zoom: number, 
        matrix: DOMMatrix, style: CanvasPattern | null) {
    
    if(!style) {return;}

    // [Refrech] 매트릭스 초기화.(최적 성능 위해 직접호출.)
    matrix.a = 1; matrix.b = 0;
    matrix.c = 0; matrix.d = 1;
    matrix.e = 0; matrix.f = 0;

    // [Convert] 중앙 기준으로 맵 (x,y)좌표에 맞게 위치설정.
    matrix.translateSelf(w / 2, h / 2);
    matrix.scaleSelf(zoom, zoom);
    matrix.translateSelf(-x, -y);

    // [Update] 패턴에 위치적용.
    style.setTransform(matrix);
}

/**
 * [Class] Rhombus
 * @description 
 * 배경에 마름모 패턴(Rhombus)을 그린다.
 */
export class Rhombus {

    style: CanvasPattern | null;
    matrix = new DOMMatrix(); // [Recycle] 재사용 위해 변수로 저장.

    constructor() {
        this.style = this.Stamp();
    }
    
    /**
     * [Function] Stamp
     * @description 
     * 배경에 반복 적용될 마름모 패턴(Rhombus)을 저장.
     */
    Stamp(): CanvasPattern | null {
        const cav = document.createElement('canvas');
        const ctx = cav.getContext('2d') as CanvasRenderingContext2D; 
        const size = {w: 100, h: 100};

        cav.width = size.w;
        cav.height = size.h;

        ctx.save();
        ctx.strokeStyle = 'rgb(54,63,63)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(size.w , size.h);
        ctx.moveTo(size.w , 0     );
        ctx.lineTo(0      , size.h);
        ctx.stroke();
        ctx.restore();

        return ctx.createPattern(cav, 'repeat');
    }

    Update(x: number, y: number, w: number, h: number, zoom: number) {
        UpdatePattern(
            x, y, w, h, zoom, 
            this.matrix, 
            this.style
        );
    }

    Draw(w: number, h: number, ctx: CanvasRenderingContext2D) {
        if(!this.style) {return;}
        
        ctx.clearRect(0, 0, w, h);

        ctx.save();
        ctx.fillStyle = this.style;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }
}

/**
 * [Class] Dot3
 * @description 
 * 배경에 3점 패턴(Dot3)을 그린다.
 * (※ perspective: 원근감 표현을 위해 이동속도 조절값이 들어 있습니다.)
 */
export class Dot3 {

    under = {
        style: null as CanvasPattern | null,
        radius: 4,
        color: 'rgb(40,50,50)',
        perspective: 0.2, // [Move] 맵 좌표 이동시 원근감 표현을 위해 이동속도 조절.              
    };
    middle = {
        style: null as CanvasPattern | null,
        radius: 5,
        color: 'rgb(70, 80, 80)',
        perspective: 0.6,
    };
    front = {
        style: null as CanvasPattern | null,
        radius: 6,
        color: 'rgb(100, 110, 110)',
        perspective: 1.0,
    };
    matrix = new DOMMatrix(); // [Recycle] 재사용 위해 변수로 저장.

    constructor() {
        this.under .style = this.Stamp(this.under .radius, this.under .color);
        this.middle.style = this.Stamp(this.middle.radius, this.middle.color);
        this.front .style = this.Stamp(this.front .radius, this.front .color);
    }
  
    Stamp(radius: number, color: string): CanvasPattern | null {
        const cav = document.createElement('canvas');
        const ctx = cav.getContext('2d') as CanvasRenderingContext2D; 
        const size = {w: 200, h: 200};

        cav.width = size.w;
        cav.height = size.h;

        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(size.w/2, size.h/2, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        return ctx.createPattern(cav, 'repeat');
    }

    Update(x: number, y: number, w: number, h: number, zoom: number) {
        // [Under] 
        UpdatePattern(
            x * this.under.perspective, 
            y * this.under.perspective, 
            w, h, zoom, 
            this.matrix, 
            this.under.style,
        );
        // [Middle]
        UpdatePattern(
            x * this.middle.perspective, 
            y * this.middle.perspective, 
            w, h, zoom, 
            this.matrix, 
            this.middle.style,
        );
        // [Front]
        UpdatePattern(
            x * this.front.perspective, 
            y * this.front.perspective,
            w, h, zoom, 
            this.matrix, 
            this.front.style,
        );
    }

    Draw(w: number, h: number, ctx: CanvasRenderingContext2D) {
        if(!this.under.style || !this.middle.style || !this.front.style) {return;}
        
        ctx.clearRect(0, 0, w, h);

        ctx.save();
        ctx.fillStyle = this.under.style;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = this.middle.style;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = this.front.style;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }
}

/**
 * [Class] Grid
 * @description 
 * 배경에 그리드 패턴(Grid)을 그린다.
 */
export class Grid {
    style: CanvasPattern | null;
    matrix = new DOMMatrix(); // [Recycle] 재사용 위해 변수로 저장.

    constructor() {
        this.style = this.Stamp();
    }
    
    /**
     * [Function] Stamp
     * @description 
     * 배경에 반복 적용될 그리드 패턴(Grid)을 저장.
     */
    Stamp(): CanvasPattern | null {
        const cav = document.createElement('canvas');
        const ctx = cav.getContext('2d') as CanvasRenderingContext2D; 
        const size = {w: 100, h: 100};

        cav.width = size.w;
        cav.height = size.h;

        ctx.save();
        ctx.strokeStyle = 'rgb(54,63,63)';
        ctx.beginPath();
        ctx.moveTo(size.w/2, 0);
        ctx.lineTo(size.w/2 , size.h);
        ctx.moveTo(       0, size.h/2);
        ctx.lineTo(size.w , size.h/2);
        ctx.stroke();
        ctx.restore();

        return ctx.createPattern(cav, 'repeat');
    }

    Update(x: number, y: number, w: number, h: number, zoom: number) {
        UpdatePattern(
            x + 50, y + 50, w, h, zoom, 
            this.matrix, 
            this.style
        );
    }

    Draw(w: number, h: number, ctx: CanvasRenderingContext2D) {
        if(!this.style) {return;}
        
        ctx.clearRect(0, 0, w, h);

        ctx.save();
        ctx.fillStyle = this.style;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }
}