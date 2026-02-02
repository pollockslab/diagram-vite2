// 메인 앱의 _VIEW 인스턴스 타입이 필요합니다. 임시로 any 처리하거나 타입을 가져오세요.
import { _VIEW, _REMO } from '../main';
import { _MAIN as _AXIS } from '../diagrams/axis'


// 인터페이스 정의
interface IDown {
    target: _AXIS;
    offsetX: number;
    offsetY: number;
    x: number;
    y: number;
    timeStamp: number;
}
interface IMove {
    x: number;
    y: number;
    isLoop: boolean;
}
interface IPinch {
    distance: number; // 터치간 거리
    targets: Map<number, PointerEvent>;
}

export class _MAIN 
{
    // 클래스 멤버 변수 타입 선언
    private down : IDown  | null = null;
    private move : IMove         = { x: 0, y: 0, isLoop: false };
    private pinch: IPinch | null = null;

    constructor(args: { parentNode: HTMLDivElement }) {
        const div = args.parentNode;

        const GetDistance = (): number => {
            if(!this.pinch || this.pinch.targets.size < 2) return 0;
            const p = Array.from(this.pinch.targets.values());
            return Math.hypot(
                p[0].clientX - p[1].clientX,
                p[0].clientY - p[1].clientY,
            );
        }
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

        // --- Mouse Event ---
        div.addEventListener('contextmenu', (e: MouseEvent) => {
            e.preventDefault();
        });

        div.addEventListener('wheel', (e: WheelEvent) => {
            // zoom 수치 업데이트
            const WHEEL_ZOOM_FACTOR = 0.001;
            _VIEW.zoom -= e.deltaY * WHEEL_ZOOM_FACTOR;
            _VIEW.isDragging = true;
        }, { passive: true });

        // --- Pan Event ---
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
                        _VIEW.zoom -= delta * PINCH_ZOOM_FACTOR;
                        _VIEW.isDragging = true;
                    }
                    if(this.pinch) this.pinch.distance = nowDistance;
                    break;
            }
        });
        
        div.addEventListener('pointerup', DeletePointerEvent);
        div.addEventListener('pointercancel', DeletePointerEvent);
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

        this.down = {
            target: dTarget,
            offsetX: screenX,
            offsetY: screenY,
            x: dTarget.x, // 마우스 다운시 x위치 기록
            y: dTarget.y, // 마우스 다운시 y위치 기록
            timeStamp: timeStamp,
        };
        _VIEW.isDragging = true;
    }

    private PanMove(screenX: number, screenY: number): void 
    {
        if (this.down === null) return;

        const remocon = _REMO.remote.id;
        if(remocon === null || remocon === 'pointer') {
            // SpaceLine이 _VIEW에 정의되어 있어야 함
            const xRange = _VIEW.SpaceLine(screenX - this.down.offsetX);
            const yRange = _VIEW.SpaceLine(screenY - this.down.offsetY);

            const dTarget = this.down.target;
            if(dTarget === _VIEW) {
                dTarget.x = this.down.x - xRange;
                dTarget.y = this.down.y - yRange;
            }
            else {
                dTarget.x = this.down.x + xRange;
                dTarget.y = this.down.y + yRange;
            }

            _VIEW.isDragging = true;
        }
    }

    private PanHover(screenX: number, screenY: number): void 
    {
        if (this.down !== null) return;

        this.move.x = screenX;
        this.move.y = screenY;
        
        if(this.move.isLoop === false) {
            
            this.move.isLoop = true;

            requestAnimationFrame(() => {
                this.move.isLoop = false;

                const spaceX = _VIEW.SpaceX(this.move.x);
                const spaceY = _VIEW.SpaceY(this.move.y);
                const oldHover = _VIEW.status.hover;
                const nowHover = _VIEW.GetCollisionChildPoint(spaceX, spaceY);
                
                // hover 대상이 변경되었을 경우만 처리
                if( nowHover !== oldHover)
                {
                    _VIEW.status.hover = nowHover;
                    _VIEW.isHover = true;
                }
            });
        }
    }

    private async PanEnd(screenX: number, screenY: number, timeStamp: number): Promise<void> 
    {
        const downTime = this.down?.timeStamp ?? 0;
        const isClick = (timeStamp-downTime < 200)? true:false;
        const remocon = _REMO.remote.id;

        if(isClick && remocon !== null) {
            const x = _VIEW.SpaceX(screenX);
            const y = _VIEW.SpaceY(screenY);

            _REMO.Action({x, y});
        }
        
        this.down = null;
        _VIEW.isDragging = true;
        // 추가 저장 로직 (리모콘 위치 저장 등) 작성 가능
    }

    
}