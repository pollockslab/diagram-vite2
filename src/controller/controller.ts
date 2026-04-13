import { _DPR, _VIEW, _REMO, _LOOP, _TRAN } from '@/main'
import { Engines } from '@/engines/engines'
import * as DiagramsType from '@/diagrams/diagrams.type'
import * as ControllerType from './controller.type'
import './controller.css'
import * as ControllerCapture from './controller.capture'


export class Controller {

    panel    : HTMLDivElement;
    down     = new ControllerCapture.Down();
    hover    = new ControllerCapture.Hover();
    select   = new ControllerCapture.Select();

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
            _TRAN.render.Resize();
        });
    }

    protected PanZoom = (size: number): void => {
        _TRAN.render.Zoom(size);
    }
     
    protected PanStart = (offsetX: number, offsetY: number, timeStamp: number): void => {
        this.down.Capture(offsetX, offsetY);
        if(this.down.instance !== null && this.down.instance !== _VIEW) {
            _TRAN.action.MoveFront(_VIEW, this.down.instance);
        }
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
                    _TRAN.render.Draw();

                }
                else {
                    if(target.edge === null) {
                        // [Move] 다이어그램 이동
                        target.diagram.x = target.x + range.w;
                        target.diagram.y = target.y + range.h;
                        _TRAN.render.Draw();
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
            // _LOOP.state.isHover = { offsetX, offsetY };
            this.hover.offsetX = offsetX;
            this.hover.offsetY = offsetY;
            _TRAN.collision.hover.Hover();

        }
    }

    // [PanEnd] 테스트하며 Command 에 넣고 전면수정 필요함.
    protected PanEnd = (offsetX: number, offsetY: number, timeStamp: number): void => {
        
        const downTime = this.down?.timeStamp ?? 0;
        const isClick = (timeStamp-downTime < 200)? true:false;
        const remocon = _REMO.remote.id;

        if(isClick && remocon !== null) {
            const x = _VIEW.SpaceX(offsetX);
            const y = _VIEW.SpaceY(offsetY);

            // 다중선택시, 어쨋든 down 정보를 보내야되나 아니면 저짝에서 읽을까 싶은
            _REMO.Action({x, y});
        }
        
        const loopArgs = new Map<string, any>();
        // 모서리 클릭시 다이어그램 사이즈 조절 종료
        if(this.down?.target.edge !== null) {
            loopArgs.set('target', this.down?.target.diagram);
        }
        /////////////////////////////////
        // 업됐으니까 끌고있던 다이어그램 정보 저장하는거 호출하자.
        // 트랜잭션에 보내.





        // (마무리) down 정보 초기화
        this.down = null;
    }

    protected PanCancel = (): void => {

    }
}

