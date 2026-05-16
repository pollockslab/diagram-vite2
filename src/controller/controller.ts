import { _MNGR } from '@/main'
import { Engines } from '@/engines/engines'
import * as ControllerType from './controller.type'
import './controller.css'


export class Controller {

    panel   : HTMLDivElement;
    down    : ControllerType.OffsetPos = this.Reset();
    move    : ControllerType.OffsetPos = this.Reset();
    up      : ControllerType.OffsetPos = this.Reset();

    constructor(args: { parentNode: HTMLElement }) {

        this.panel = document.createElement('div');
        this.panel.id = 'controller';
        args.parentNode.appendChild(this.panel);

        new Engines.EventPan({
            panel: this.panel,
            callers: {
                zoom    : this.PanZoom,
                start   : this.PanStart,
                move    : this.PanMove,
                end     : this.PanEnd,
                cancel  : this.PanCancel,
            },
        });

        window.addEventListener('resize', () => {
            _MNGR.render.Resize();
        });
    }

    protected PanZoom = (size: number): void => {
        _MNGR.render.Zoom(size);
    }
     
    protected PanStart = (offsetX: number, offsetY: number, timeStamp: number): void => {
        this.down = {offsetX, offsetY, timeStamp};
        _MNGR.controller.Down();
    }

    protected PanMove = (offsetX: number, offsetY: number, timeStamp: number, isDown: boolean): void  => {
        this.move = {offsetX, offsetY, timeStamp};
        if(isDown) {
            _MNGR.controller.Drag();
        }
        else {
            _MNGR.controller.Hover();
        }
      
    }
    
    protected PanEnd = (offsetX: number, offsetY: number, timeStamp: number): void => {
        this.up = {offsetX, offsetY, timeStamp};
        const rangeX = Math.abs(offsetX - this.down.offsetX);
        const rangeY = Math.abs(offsetY - this.down.offsetY);
        const isClick = 
            (timeStamp-this.down.timeStamp < 100) 
            && (rangeX < 4 && rangeY < 4);
        if(isClick) {
            _MNGR.controller.Click();
        }
        else {
            _MNGR.controller.Up();
        }
        this.down = this.Reset();
        this.move = this.Reset();
        this.up   = this.Reset();
    }

    protected PanCancel = (): void => {
        this.down = this.Reset();
        this.move = this.Reset();
        this.up   = this.Reset();
    }

    private Reset(): ControllerType.OffsetPos {
        return {
            offsetX     : 0,
            offsetY     : 0,
            timeStamp   : 0,
        };
    }

    CursorStyle(type: string) {

        const style: 'default'|'pointer'|'grabbing'|'crosshair'|'not-allowed'|'cell' = 'cell';
        this.panel.style.cursor = style;

        switch(type) {
            case 'pointer': {
                this.panel.style.cursor = 'default';
                break;
            }
            case 'create': {
                this.panel.style.cursor = 'cell';
                break;
            }
            case 'delete': {
                this.panel.style.cursor = 'not-allowed';
                // 휴지통 모양이나 붉은색 X 아이콘을 커서로 사용
                // canvas.style.cursor = `url('delete-icon.png') 12 12, auto`;
                break;
            }
            default: {
                this.panel.style.cursor = 'pointer';
                break;
            }

        }
    }
}

