
import { _VIEW, _REMO } from '../main';
import { type _CT } from './controller.type'


export class _MAIN 
{
    parentNode: HTMLDivElement;

    // 클래스 멤버 변수 타입 선언
    public down    : _CT.DOWN  | null = null;
    private move    : _CT.MOVE         = { x: 0, y: 0, isLoop: false };
    private pinch   : _CT.PINCH | null = null;
  
    loop = {
        isLoop: false,
        isHover: false,
        isEdge: false,
        isDraw: false,
        isResize: false,
        isRender: false,
        isCaptureCompact: false,
        isCaptureExpand: false,
    }

    constructor(args: { parentNode: HTMLDivElement }) {
        const div = args.parentNode;
        this.parentNode = div;
        this.Resize();

        // --- 터치 두손가락 범위 구하기 ---
        const GetDistance = (): number => {
            if(!this.pinch || this.pinch.targets.size < 2) return 0;
            const p = Array.from(this.pinch.targets.values());
            return Math.hypot(
                p[0].clientX - p[1].clientX,
                p[0].clientY - p[1].clientY,
            );
        }

        // --- 포인터 이벤트 회수(cancel, mouseup) ---
        const DeletePointerEvent = (e: PointerEvent) => {
            div.releasePointerCapture(e.pointerId);
            if(!this.pinch || !this.pinch.targets.has(e.pointerId)) {return;}
            this.pinch.targets.delete(e.pointerId);

            switch(this.pinch.targets.size) {
                case 0:
                    if(this.down) {
                        this.PanEnd(e.offsetX, e.offsetY, e.timeStamp);
                    }
                    this.pinch = null;
                    this.down = null;
                    break;
                case 1:
                    this.pinch.distance = 0;
                    break;
            }
        }
        
        window.addEventListener('resize', () => { 
            this.Resize(); 
        });

        div.addEventListener('contextmenu', (e: MouseEvent) => {
            e.preventDefault();
        });

        div.addEventListener('wheel', (e: WheelEvent) => {
            const WHEEL_ZOOM_FACTOR = 0.001;
            this.PanZoom(-e.deltaY * WHEEL_ZOOM_FACTOR);
        }, { passive: true });

        // --- 펜 이벤트(down, move, up) ---
        div.addEventListener('pointerdown', (e: PointerEvent) => {

            // 세번째 이상 터치는 무시
            if(this.pinch && this.pinch.targets.size >= 2) {return;}

            div.setPointerCapture(e.pointerId);

            if(this.pinch === null) { this.pinch = { distance:0, targets: new Map()}; }
            this.pinch.targets.set(e.pointerId, e);

            switch(this.pinch.targets.size)
            {
                case 1: // 단일터치: 드래그
                    this.PanStart(e.offsetX, e.offsetY, e.timeStamp);
                    break;
                case 2: // 멀티터치: 화면 줌 모드로 전환(외에 기능없음)
                    this.pinch.distance = GetDistance();
                    break;
            }
        });

        div.addEventListener('pointermove', (e: PointerEvent) => {
            if(this.pinch?.targets.has(e.pointerId)) {
                this.pinch.targets.set(e.pointerId, e); // 포인터 위치 업데이트
            }
            
            switch(this.pinch?.targets.size ?? 0)
            {
                case 0:
                    this.PanHover(e.offsetX, e.offsetY);
                    break;
                case 1: // 단일터치: 드래그
                    this.PanMove(e.offsetX, e.offsetY);
                    break;
                case 2: // 멀티터치: 화면 줌
                    const nowDistance = GetDistance();
                    if(this.pinch && this.pinch.distance > 0) {
                        const delta = this.pinch.distance - nowDistance;
                        const PINCH_ZOOM_FACTOR = 0.002;
                        this.PanZoom(-delta * PINCH_ZOOM_FACTOR);
                    }
                    if(this.pinch) this.pinch.distance = nowDistance;
                    break;
            }
        });
        
        div.addEventListener('pointerup', DeletePointerEvent);
        div.addEventListener('pointercancel', DeletePointerEvent);
    }

    Resize()
    {
        _VIEW.scope.w = window.innerWidth;
        _VIEW.scope.h = window.innerHeight;

        this.loop.isResize = true;
        this.Loop(null);
    }

    private PanZoom(size: number)
    {
        _VIEW.zoom += size;
        this.loop.isDraw = true;
        this.Loop(null);
    }
     
    private PanStart(screenX: number, screenY: number, timeStamp: number): void 
    {
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
            this.loop.isCaptureExpand = true;
        }
        this.loop.isDraw = true;
        this.Loop(null);
    }

    private PanMove(screenX: number, screenY: number): void 
    {
        if (this.down === null) return;

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

            this.loop.isDraw = true;
            this.Loop(null);
        }
    }

    private PanHover(screenX: number, screenY: number): void 
    {
        if (this.down !== null) return;

        this.move.x = screenX;
        this.move.y = screenY;
        
        this.loop.isHover = true;
        this.Loop(null);
    }

    private PanEnd(screenX: number, screenY: number, timeStamp: number): void
    {
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
            this.loop.isCaptureCompact = true;
            loopArgs.set('target', this.down?.target);
        }
        this.loop.isDraw = true;
        this.Loop(loopArgs);

        // (마무리) down 정보 초기화
        this.down = null;
    }

    /**
     * 공통 리퀘스트 애니메이션
     * @param args 
     */
    Loop(args: null|Record<string, any>)
    {
        if(this.loop.isLoop === false) {
            this.loop.isLoop = true;

            requestAnimationFrame(() => {
                this.loop.isLoop = false;
                
                if(this.loop.isEdge === true) {
                    this.loop.isEdge = false;
                }
                if(this.loop.isHover === true) {
                    this.loop.isHover = false;
                    this.CheckCollisionEdge();
                }
                // isCaptureCompact, isCaptureExpand
                if(this.loop.isCaptureCompact === true) {
                    this.loop.isCaptureCompact = false;
                    const dCompact = args?.get('target');
                    if(dCompact !== null) {
                        console.log(dCompact, args)
                        dCompact.InitCapture(0);
                        dCompact.Render();
                    }
                }
                if(this.loop.isCaptureExpand === true) {
                    this.loop.isCaptureExpand = false;
                    const dExpand = this.down?.target;
                    dExpand?.InitCapture(1);
                    dExpand?.Render();
                }
                if(this.loop.isRender === true) {
                    this.loop.isRender = false;

                    _VIEW.Draw();
                }
                if(this.loop.isDraw === true) {
                    this.loop.isDraw = false;
                    _VIEW.Draw();
                }

                if(this.loop.isResize === true) {
                    this.loop.isResize = false;
                    
                    Object.values(_VIEW.layers).forEach(layer => 
                    {
                        layer.cav.width = _VIEW.scope.w * _VIEW.scope.dpr;
                        layer.cav.height = _VIEW.scope.h * _VIEW.scope.dpr;
                    });
                    _VIEW.Draw();
                }

            });
        }
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
            this.loop.isDraw = true;
            this.Loop(null);
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
        this.parentNode.style.setProperty('cursor', cursorStyle, 'important');
    }
}