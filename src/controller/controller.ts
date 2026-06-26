import { _MNGR } from '@/main'
import * as SpaceType from '@/space/space.type'
import { Engines } from '@/engines/engines'
import * as ControllerType from './controller.type'
import { ControllerKeyboard } from './controller.keyboard'
import './controller.css'


new ControllerKeyboard();
const cursorStyles = new Set([
  // 기본
  'auto', 'default', 'none',
  // 링크/텍스트
  'pointer', 'text', 'vertical-text',
  // 상태/처리중
  'wait', 'progress',
  // 이동/드래그
  'move', 'grab', 'grabbing',
  // 리사이즈(단방향)
  'e-resize', 'w-resize', 'n-resize', 's-resize',
  // 리사이즈(대각선)
  'ne-resize', 'nw-resize', 'se-resize', 'sw-resize',
  // 리사이즈(양방향)
  'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize',
  // 선택/정밀
  'crosshair', 'cell',
  // 도움/금지
  'help', 'not-allowed',
  // 드래그 앤 드롭 힌트
  'alias', 'copy',
  // 스크롤/패닝
  'all-scroll', 'col-resize', 'row-resize',
  // 기타
  'context-menu', 'zoom-in', 'zoom-out'
]);

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
        
        const rangeX = Math.abs(offsetX - this.down.offsetX);
        const rangeY = Math.abs(offsetY - this.down.offsetY);
        const isClick = 
            (timeStamp-this.down.timeStamp < 200) 
            && (rangeX < 4 && rangeY < 4);
        const isDblclick = 
            (timeStamp-this.up.timeStamp < 200) 
            && isClick;

        this.up = {offsetX, offsetY, timeStamp};
        if(isDblclick) {
            _MNGR.controller.Dblclick();
        }
        else if(isClick) {
            _MNGR.controller.Click();
        }
        else {
            _MNGR.controller.Up();
        }
        this.down = this.Reset();
        this.move = this.Reset();
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

    CursorStyle(type?: string|undefined) {
        if(type === undefined) {this.panel.style.cursor = 'default';}
        else if(cursorStyles.has(type)) {this.panel.style.cursor = type;}
        else {this.panel.style.cursor = 'default';}
    }
}

