
import { _VIEW, _REMO, _LOOP } from '../main';
import { type _CT } from './controller.type'
import { _ENGINES } from '../engines/engines'


export class _MAIN {

    protected pinch   : _CT.PINCH | null = null;
    protected down    : _CT.DOWN  | null = null;
    protected move    : _CT.MOVE         = { x: 0, y: 0, isLoop: false };

    constructor(args: { parentNode: HTMLDivElement }) {

        new _ENGINES.event.pan({
            panel: args.parentNode,
            callers: {
                zoom    : this.PanZoom,
                start   : this.PanStart,
                move    : this.PanMove,
                end     : this.PanEnd,
                cancel  : this.PanCancel,
            }
        });
    }

    protected PanZoom = (size: number) => {
        _VIEW.zoom += size;
        // this.loop.isDraw = true;
        // this.Loop(null);
        _VIEW.Draw();
    }
     
    protected PanStart = (screenX: number, screenY: number, timeStamp: number): void => {
        const spaceX = _VIEW.SpaceX(screenX);
        const spaceY = _VIEW.SpaceY(screenY);
        const dCollision = _VIEW.GetCollisionChildPoint(spaceX, spaceY);
        
        
        if(dCollision !== null) {
            // 클릭한 다이어그램 상단으로 올리기
            _VIEW.SetOrderChild(dCollision);
        }


        const dTarget = (dCollision)? dCollision : _VIEW;
        const dEdge = (dCollision)? 
            dCollision.GetCollisionEdge(spaceX, spaceY) : null;

        this.down = {
            target: dTarget,
            offsetX: screenX,
            offsetY: screenY,
            x: dTarget.x, // 마우스 다운시 x위치 기록
            y: dTarget.y, // 마우스 다운시 y위치 기록
            w: dTarget.w,
            h: dTarget.h,
            timeStamp: timeStamp,
            edge: dEdge,
        };

        // 모서리 클릭시 다이어그램 사이즈 조절 시작
        if(this.down.edge !== null) {
            console.log(dEdge)
        }
    }

    protected PanMove = (screenX: number, screenY: number, timeStamp: number, isDown: boolean): void  => {
    
        if (isDown === true) {
            if(this.down === null) return;
            const remocon = _REMO.remote.id;
            if(remocon === null || remocon === 'pointer') 
            {
                // SpaceLine이 _VIEW에 정의되어 있어야 함
                const xRange = _VIEW.SpaceLine(screenX - this.down.offsetX);
                const yRange = _VIEW.SpaceLine(screenY - this.down.offsetY);

                const dTarget = this.down.target;
                if(dTarget === _VIEW) {
                    // 맵 이동
                    dTarget.x = this.down.x - xRange;
                    dTarget.y = this.down.y - yRange;
                }
                else {
                    if(this.down.edge === null) {
                        // 다이어그램 이동
                        dTarget.x = this.down.x + xRange;
                        dTarget.y = this.down.y + yRange;
                    }
                    else {
                        // 다이어그램 리사이즈
                        this.ResizeDiagram(xRange, yRange);
                    }
                }

            }    
        }
        else {
        }
    }

    protected PanHover = (screenX: number, screenY: number): void  => {

        if (this.down !== null) return;

        this.move.x = screenX;
        this.move.y = screenY;
        
    }

    protected PanEnd = (screenX: number, screenY: number, timeStamp: number): void => {
        
        const downTime = this.down?.timeStamp ?? 0;
        const isClick = (timeStamp-downTime < 200)? true:false;
        const remocon = _REMO.remote.id;

        if(isClick && remocon !== null) {
            const x = _VIEW.SpaceX(screenX);
            const y = _VIEW.SpaceY(screenY);

            // 다중선택시, 어쨋든 down 정보를 보내야되나 아니면 저짝에서 읽을까 싶은
            _REMO.Action({x, y});
        }
        
        const loopArgs = new Map<string, any>();
        // 모서리 클릭시 다이어그램 사이즈 조절 종료
        if(this.down?.edge !== null) {
            loopArgs.set('target', this.down?.target);
        }

        // (마무리) down 정보 초기화
        this.down = null;
    }

    protected PanCancel = () => {

    }
    

    ResizeDiagram(xRange:number, yRange:number)
    {
        if(this.down === null) return;

        const size = new Map<string, number>();
        // w, h 가 100 이하면 반려하자
        switch (this.down.edge) 
        {
            case 'e': 
                size.set('w', this.down.w + xRange);
                break;
            case 'w':
                size.set('x', this.down.x + xRange);
                size.set('w', this.down.w - xRange);
                break;
            case 's': 
                size.set('h', this.down.h + yRange);
                break;
            case 'n':
                size.set('y', this.down.y + yRange);
                size.set('h', this.down.h - yRange);
                break;
            case 'es':
                size.set('w', this.down.w + xRange);
                size.set('h', this.down.h + yRange);
                break; 
            case 'wn':
                size.set('x', this.down.x + xRange);
                size.set('w', this.down.w - xRange);

                size.set('y', this.down.y + yRange);
                size.set('h', this.down.h - yRange);
                break;
            case 'en':
                size.set('w', this.down.w + xRange);

                size.set('y', this.down.y + yRange);
                size.set('h', this.down.h - yRange);
                break; 
            case 'ws':
                size.set('x', this.down.x + xRange);
                size.set('w', this.down.w - xRange);

                size.set('h', this.down.h + yRange);
                break;
        }

        
        const sizeObj = Object.fromEntries(size);
        if(sizeObj.w !== undefined && sizeObj.w <= 100) return;
        if(sizeObj.h !== undefined && sizeObj.h <= 100) return;
        if(sizeObj.w !== undefined && sizeObj.w >= 1000) return;
        if(sizeObj.h !== undefined && sizeObj.h >= 1000) return;

        const dTarget = this.down.target;
        dTarget.SetData(sizeObj);
        dTarget.Render();
    }

    CheckCollisionEdge()
    {
        const spaceX = _VIEW.SpaceX(this.move.x);
        const spaceY = _VIEW.SpaceY(this.move.y);
        const oldHover = _VIEW.status.hover;
        const nowHover = _VIEW.GetCollisionChildPoint(spaceX, spaceY);
        
        // hover 대상이 변경되었을 경우만 처리
        if( nowHover !== oldHover ) {
            _VIEW.status.hover = nowHover;
        }

        let cursorStyle = 'default';
        if( nowHover !== null ) {
            const edge = nowHover.GetCollisionEdge(spaceX, spaceY);
            switch (edge) 
            {
                case 'e': 
                case 'w':
                    cursorStyle = 'ew-resize';
                    break;
                case 's': 
                case 'n':
                    cursorStyle = 'ns-resize';
                    break;
                case 'es': 
                case 'wn':
                    cursorStyle = 'nwse-resize';
                    break;
                case 'en': 
                case 'ws':
                    cursorStyle = 'nesw-resize';
                    break;
                default:
                    cursorStyle = 'move';
                    break;
            }
        }
        // this.panel.style.setProperty('cursor', cursorStyle, 'important');
    }
}