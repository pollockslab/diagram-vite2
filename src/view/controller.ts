// 메인 앱의 _VIEW 인스턴스 타입이 필요합니다. 임시로 any 처리하거나 타입을 가져오세요.
import { _VIEW, _REMO } from '../main';
import { _MAIN as _AXIS } from '../diagrams/axis'

const WHEEL_ZOOM_FACTOR = 0.001;
const PINCH_ZOOM_FACTOR = 0.002;

// 인터페이스 정의
interface PanState {
    target: Record<string, any>;
    offsetX: number;
    offsetY: number;
    x: number;
    y: number;
    timeStamp: number;
}

interface PinchState {
    dist: number;
}

type TouchMode = 'pan' | 'pinch' | null;

export class _MAIN {
    // 클래스 멤버 변수 타입 선언
    private down: PanState | null = null;
    private pinch: PinchState | null = null;
    private touchMode: TouchMode = null;
   

    constructor(args: { parentNode: HTMLDivElement }) {
        const div = args.parentNode;

        // --- Mouse Event ---
        div.addEventListener('contextmenu', (e: MouseEvent) => {
            e.preventDefault();
        });

        div.addEventListener('wheel', (e: WheelEvent) => {
            // zoom 수치 업데이트
            _VIEW.zoom -= e.deltaY * WHEEL_ZOOM_FACTOR;
            _VIEW.isDragging = true;
        }, { passive: true });

        div.addEventListener('mousedown', (e: MouseEvent) => {
            this.PanStart(e.offsetX, e.offsetY, e.timeStamp);
        });

        div.addEventListener('mousemove', (e: MouseEvent) => {
            this.PanMove(e.offsetX, e.offsetY);
        });

        div.addEventListener('mouseup', (e: MouseEvent) => {
            this.PanEnd(e.offsetX, e.offsetY, e.timeStamp);
        });

        div.addEventListener('mouseleave', () => {
            this.down = null;
            this.touchMode = null;
        });

        // --- Touch Event ---
        div.addEventListener('touchstart', (e: TouchEvent) => {
            // === pan 시작 ===
            if (e.touches.length === 1 && this.touchMode !== 'pinch') {
                const t = e.touches[0];
                this.touchMode = 'pan';
                this.PanStart(t.clientX, t.clientY, e.timeStamp);
            }

            // === pinch 시작 ===
            if (e.touches.length === 2) {
                const t1 = e.touches[0];
                const t2 = e.touches[1];

                const dx = t1.clientX - t2.clientX;
                const dy = t1.clientY - t2.clientY;

                this.touchMode = 'pinch';
                this.pinch = {
                    dist: Math.hypot(dx, dy)
                };
            }
        }, { passive: false });

        div.addEventListener('touchmove', (e: TouchEvent) => {
            // === pan ===
            if (this.touchMode === 'pan' && e.touches.length === 1) {
                const t = e.touches[0];
                this.PanMove(t.clientX, t.clientY);
                e.preventDefault();
            }

            // === pinch zoom ===
            if (this.touchMode === 'pinch' && e.touches.length === 2 && this.pinch) {
                const t1 = e.touches[0];
                const t2 = e.touches[1];

                const dx = t1.clientX - t2.clientX;
                const dy = t1.clientY - t2.clientY;
                const dist = Math.hypot(dx, dy);

                const delta = this.pinch.dist - dist;
                this.pinch.dist = dist;

                _VIEW.zoom += delta * PINCH_ZOOM_FACTOR;
                _VIEW.isDragging = true;
                e.preventDefault();
            }
        }, { passive: false });

        div.addEventListener('touchend', (e: TouchEvent) => {
            // === pinch 종료 ===
            if (this.touchMode === 'pinch' && e.touches.length < 2) {
                this.touchMode = null;
                this.pinch = null;
                return;
            }

            // === pan 종료 ===
            if (this.touchMode === 'pan' && e.touches.length === 0) {
                const touch = e.changedTouches[0];
                const rect = div.getBoundingClientRect();

                const offsetX = touch.clientX - rect.left;
                const offsetY = touch.clientY - rect.top;

                this.touchMode = null;
                this.PanEnd(offsetX, offsetY, e.timeStamp);
            }
        });
    }

    private PanStart(screenX: number, screenY: number, timeStamp: number): void 
    {
        const spaceX = _VIEW.SpaceX(screenX);
        const spaceY = _VIEW.SpaceY(screenY);
        const dCollision = _VIEW.GetCollisionChildPoint(spaceX, spaceY);
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

    // private mousePos = { x: 0, y: 0 };
    // private needsHoverCheck = false;
    private PanMove(screenX: number, screenY: number): void 
    {
        const spaceX = _VIEW.SpaceX(screenX);
        const spaceY = _VIEW.SpaceY(screenY);

        const oldHover = _VIEW.status.hover;
        const nowHover = _VIEW.GetCollisionChildPoint(spaceX, spaceY);
        
        // hover 대상이 변경되었을 경우만 처리
        if( nowHover !== oldHover)
        {
            _VIEW.status.hover = nowHover;
            _VIEW.isHover = true;
        }

        if (!this.down) return;

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
        _VIEW.isDragging = false;
        // 추가 저장 로직 (리모콘 위치 저장 등) 작성 가능
        
    }

    
}