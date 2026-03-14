import { Engines } from '../engines/engines'
import { _DPR, _VIEW, _REMO, _LOOP } from '../main'
import * as ControllerType from './controller.type'
import * as TransactionView from '../transaction/transaction.view'
import * as diagramsType from '../diagrams/diagrams.type'
import * as diagramsCollisionPoint from '../diagrams/diagrams.collision.point'
import * as diagramsCollisionEdge from '../diagrams/diagrams.collision.edge'
import * as diagramsChildren from '../diagrams/diagrams.children'
import './controller.css'


export class Controller {

    private panel   : HTMLDivElement;
    private down    : ControllerType.Down | null = null;

    constructor(args: { parentNode: HTMLDivElement }) {

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
            _DPR.Update();
            _VIEW.Resize();
            _LOOP.isDraw = true;
        });
    }

    protected PanZoom = (size: number): void => {
        TransactionView.SetZoom(size);
    }
     
    protected PanStart = (offsetX: number, offsetY: number, timeStamp: number): void => {
        
        const spaceX = _VIEW.SpaceX(offsetX);
        const spaceY = _VIEW.SpaceY(offsetY);
        const collisionTarget = diagramsCollisionPoint.GetChildFirst(_VIEW, spaceX, spaceY) ?? _VIEW;
        let edge: diagramsType.Edge | null = null;

        if(collisionTarget !== _VIEW) {
            // [Convert] 클릭한 다이어그램 최상단으로 올리기
            diagramsChildren.SetTopZIndex(_VIEW, collisionTarget);
            edge = diagramsCollisionEdge.Check(collisionTarget, spaceX, spaceY);
        }

        this.down = {
            offsetX: screenX,
            offsetY: screenY,
            target: {
                diagram: collisionTarget,
                edge: edge,
                x: collisionTarget.x, // 마우스 다운시 좌표 복사
                y: collisionTarget.y,
                w: collisionTarget.w,
                h: collisionTarget.h,
                serialize: collisionTarget.serialize,
            },
            timeStamp: timeStamp,
        };
    }

    protected PanMove = (offsetX: number, offsetY: number, timeStamp: number, isDown: boolean): void  => {
    
        if(isDown) {
            if(this.down === null) {return;}

            const remocon = _REMO.remote.id;
            if(remocon === null || remocon === 'pointer') {

                const range = {
                    w: _VIEW.SpaceLine(offsetX - this.down.offsetX),
                    h: _VIEW.SpaceLine(offsetY - this.down.offsetY),
                };

                const target = this.down.target;
                if(target.diagram === _VIEW) {
                    // [Move] 맵 이동
                    _VIEW.x = target.x - range.w;
                    _VIEW.y = target.y - range.h;

                    _LOOP.isDraw = true;
                }
                else {
                    if(target.edge === null) {
                        // [Move] 다이어그램 이동
                        target.diagram.x = target.x - range.w;
                        target.diagram.y = target.y - range.h;
                    }
                    else {
                        // 다이어그램 리사이즈
                        // this.ResizeDiagram(xRange, yRange);
                    }
                }
            }    
        }
        // [Hover]
        else {
            // loop 에 collision.check 요청하기.
        }
    }

    // [PanEnd] 테스트하며 Command 에 넣고 전면수정 필요함.
    protected PanEnd = (offsetX: number, offsetY: number, timeStamp: number): void => {
        
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
        if(this.down?.target.edge !== null) {
            loopArgs.set('target', this.down?.target.diagram);
        }

        // (마무리) down 정보 초기화
        this.down = null;
    }

    protected PanCancel = (): void => {

    }
}