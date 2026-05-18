
import { _CTRL, _DPR, _SPCE  } from '@/main'
import * as Diagrams from '@/diagrams/diagrams'

import { ViewBackground } from './view.background'
import { ViewBoard } from './view.board'
import { ViewEffect } from './view.effect'
import './view.css'


export class View extends Diagrams.Class.Square
{
    panel: HTMLDivElement;
    view = {
        zoom: {
            size: 1,
            min : 0.5, 
            max : 2,
        },
        offset: {
            width: 0,
            height: 0,
        },
    };
    background  : ViewBackground;
    board       : ViewBoard;
    effect      : ViewEffect;
    
    constructor(args: {parentNode: HTMLElement}) {
        super();
        
        // [Cover] 배경 담을 div 생성
        this.panel = document.createElement('div');
        this.panel.id = 'view';
        args.parentNode.appendChild(this.panel);

        // [Create] 배경 순차적 생성. (1. Background, 2. Board, 3. Effect)
        this.background = new ViewBackground({parentNode: this.panel});
        this.board      = new ViewBoard     ({parentNode: this.panel});
        this.effect     = new ViewEffect    ({parentNode: this.panel});

        // [Resize] 배경 생성직후, 캔버스 초기화 위해 호출.
        this.Resize();
    }
    
    get zoom() {
        return this.view.zoom.size;
    }
    set zoom(size) {
        const zoom = this.view.zoom;
        if(size >= zoom.min && size <= zoom.max) {
            zoom.size = size;
        }
    }
    get offsetW() {
        return this.view.offset.width;
    }
    set offsetW(offsetWidth: number) {
        this.view.offset.width = offsetWidth;
    }
    get offsetH() {
        return this.view.offset.height;
    }
    set offsetH(offsetHeight: number) {
        this.view.offset.height = offsetHeight;
    }

    Resize() {
        const width  = this.panel.offsetWidth;
        const height = this.panel.offsetHeight;
        this.offsetW = width;
        this.offsetH = height;

        this.background.Resize(width, height);
        this.board     .Resize(width, height);
        this.effect    .Resize(width, height);
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

    Draw() {
        // !!!!!!! controller 에서 command 로 Move 보내는 형식으로 바꾼 이후에
        // 여기서 직접 Update 호출부분 삭제필요.
        
        // [Background]
        this.background.Update(this.x, this.y, this.zoom);
        this.background.Draw();

        // [Board]
        const wHalf = this.offsetW/2;
        const hHalf = this.offsetH/2;
        const start = {
            x: this.x-wHalf,
            y: this.y-hHalf,
        };
        const end = {
            x: this.x+wHalf,
            y: this.y+hHalf,
        };
        const children = _SPCE.SelectArea(start.x, start.y, end.x, end.y);
        this.board.Update(this.x, this.y, this.zoom);
        this.board.Draw(this.x, this.y, children);

        // [Effect]
        this.effect.Update(this.x, this.y, this.zoom);
        this.effect.Draw(this.x, this.y);
    }

}