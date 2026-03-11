
import * as ControllerType from './controller.type'
import { _VIEW, _REMO, _LOOP } from '../main'
import { _ENGINES } from '../engines/engines'


export class _MAIN {

    private down: ControllerType.Down | null = null;
    private move: ControllerType.Move        = { x: 0, y: 0, isLoop: false };

    constructor(args: { parentNode: HTMLDivElement }) {

        new _ENGINES._EVENT_PAN({
            panel: args.parentNode,
            callers: {
                zoom    : this.PanZoom,
                start   : this.PanStart,
                move    : this.PanMove,
                end     : this.PanEnd,
                cancel  : this.PanCancel,
            },
        });
    }

    protected PanZoom = (size: number) => {
        // 트랜잭션.SetZoom
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

    protected PanCancel = (): void => {

    }
}