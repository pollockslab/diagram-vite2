
import { _CTRL, _DPR, _SPCE  } from '@/main'
import { ViewBackground } from './view.background'
import { ViewBoard } from './view.board'
import { ViewEffect } from './view.effect'
import * as ViewType from './view.type'
import './view.css'


export class View {
    panel: HTMLDivElement;
    pos = {
        zoom: {
            size: 1,
            min : 0.1, 
            max : 2,
        },
        offset: {
            width: 0,
            height: 0,
        },
        space: {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
        }
    };
    background  : ViewBackground;
    board       : ViewBoard;
    effect      : ViewEffect;
    cav         : HTMLCanvasElement;
    ctx         : CanvasRenderingContext2D;
    
    constructor(args: {parentNode: HTMLElement}) {
        
        // [Cover] 배경 담을 div 생성
        this.panel = document.createElement('div');
        this.panel.id = 'view';
        args.parentNode.appendChild(this.panel);
        this.cav = document.createElement('canvas');
        this.ctx = this.cav.getContext('2d') as CanvasRenderingContext2D;
        this.panel.appendChild(this.cav);

        // [Draw] 그림 그리는 객체 (밑배경, 다이어그램, 효과)
        this.background = new ViewBackground(this);
        this.board      = new ViewBoard     (this);
        this.effect     = new ViewEffect    (this);

        // [Resize] 배경 생성직후, 캔버스 초기화 위해 호출.
        this.Resize();
    }
    
    // [Value] zoom
    get zoom() {
        return this.pos.zoom.size;
    }
    set zoom(size) {
        const zoom = this.pos.zoom;
        if(size >= zoom.min && size <= zoom.max) {
            zoom.size = size;

            const width  = this.panel.offsetWidth;
            const height = this.panel.offsetHeight;
        
            this.width = this.SpaceLine(width);
            this.height = this.SpaceLine(height);
        }
    }

    // [Value] offset
    get offsetW() {
        return this.pos.offset.width;
    }
    set offsetW(offsetWidth: number) {
        this.pos.offset.width = offsetWidth;
    }
    get offsetH() {
        return this.pos.offset.height;
    }
    set offsetH(offsetHeight: number) {
        this.pos.offset.height = offsetHeight;
    }

    // [Value] space
    get x() {
        return this.pos.space.x;
    }
    set x(size) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.pos.space.x = (!Number.isFinite(size))? 0 : size;
    }
    get y() {
        return this.pos.space.y;
    }
    set y(size) {
        // [Validation] 비정상적인 숫자일 때 0으로 초기화 하여 화면이탈 방지
        // 예: NaN, Infinity, 부동소수점 이슈
        this.pos.space.y = (!Number.isFinite(size))? 0 : size;
    }
    get width() {
        return this.pos.space.w;
    }
    set width(size) {        
        this.pos.space.w = (!Number.isFinite(size))? 0 : size;
    }   
    get height() {
        return this.pos.space.h;
    }
    set height(size) {
        this.pos.space.h = (!Number.isFinite(size))? 0 : size;
    }

    Resize() {
        // [Optimize] offsetWidth 를 호출시, 크기 연산을 매번 하기 때문에,
        // 최적화 위해서 Resize 호출시 값을 저장해서 사용하도록 함.
        const width  = this.panel.offsetWidth;
        const height = this.panel.offsetHeight;
        
        this.offsetW = width;   
        this.offsetH = height;

        this.width = this.SpaceLine(width);
        this.height = this.SpaceLine(height);

        const dpr = _DPR.value
        this.cav.width = width * dpr;
        this.cav.height = height * dpr;
    }

    SpaceX(offsetX: number): number {
        return Math.round((offsetX-(this.offsetW/2))/this.zoom + this.x);
    }

    SpaceY(offsetY: number): number {
        return Math.round((offsetY-(this.offsetH/2))/this.zoom + this.y);
    }

    SpaceLine(pixel:number): number {
        return Math.round(pixel/this.zoom);
    }

    GetRect(): ViewType.GetRect {
        const halfWidth  = this.width /2;
        const halfHeight = this.height/2;
        return {
            left : this.x - halfWidth, top   : this.y - halfHeight,
            right: this.x + halfWidth, bottom: this.y + halfHeight, 
            width: this.width        , height: this.height        , 
        };
    }

    ClearRect() {
        const dpr = _DPR.value;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // 초기화
       
        this.ctx.translate(this.offsetW/2, this.offsetH/2); // 중앙으로
        this.ctx.scale(this.zoom, this.zoom); // 줌 적용(space)
        this.ctx.translate(-this.x, -this.y); // space x, y 만큼 이동

        this.ctx.clearRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);
    }
}