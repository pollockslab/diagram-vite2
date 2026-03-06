
import { type _CT } from './controller.type'

export class _MAIN {

    protected parentNode     : HTMLDivElement;
    protected pinch   : _CT.PINCH | null = null;
    protected down    : _CT.DOWN  | null = null;
    protected move    : _CT.MOVE         = { x: 0, y: 0, isLoop: false };


    constructor(args: { parentNode: HTMLDivElement }) {  
        
        this.parentNode = args.parentNode;
        this.pinch = {
            distance: 0, 
            targets: new Map<number, PointerEvent>()
        }
        
        window.addEventListener('resize', () => { 
            // this.Resize(); 
        });

        this.parentNode.addEventListener('contextmenu', (e: MouseEvent) => {
            e.preventDefault();
        });

        this.parentNode.addEventListener('wheel', (e: WheelEvent) => {
            const WHEEL_ZOOM_FACTOR = 0.001;
            this.PanZoom(-e.deltaY * WHEEL_ZOOM_FACTOR);
        }, { passive: true });

        // --- 펜 이벤트(down, move, up) ---
        this.parentNode.addEventListener('pointerdown', (e: PointerEvent) => {

            // 세번째 이상 터치는 무시
            if(this.pinch && this.pinch.targets.size >= 2) {return;}

            this.parentNode.setPointerCapture(e.pointerId);

            if(this.pinch === null) { this.pinch = { distance:0, targets: new Map()}; }
            this.pinch.targets.set(e.pointerId, e);

            switch(this.pinch.targets.size)
            {
                case 1: // 단일터치: 드래그
                    this.PanStart(e.offsetX, e.offsetY, e.timeStamp);
                    break;
                case 2: // 멀티터치: 화면 줌 모드로 전환(외에 기능없음)
                    this.pinch.distance = this.GetDistance();
                    break;
            }
        });

        this.parentNode.addEventListener('pointermove', (e: PointerEvent) => {
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
                    const nowDistance = this.GetDistance();
                    if(this.pinch && this.pinch.distance > 0) {
                        const delta = this.pinch.distance - nowDistance;
                        const PINCH_ZOOM_FACTOR = 0.002;
                        this.PanZoom(-delta * PINCH_ZOOM_FACTOR);
                    }
                    if(this.pinch) this.pinch.distance = nowDistance;
                    break;
            }
        });
        
        this.parentNode.addEventListener('pointerup', this.DeletePointerEvent);
        this.parentNode.addEventListener('pointercancel', this.DeletePointerEvent);
    }

    protected PanZoom (size: number) {}
    protected PanStart(screenX: number, screenY: number, timeStamp: number) {}
    protected PanMove (screenX: number, screenY: number) {}
    protected PanHover(screenX: number, screenY: number) {}
    protected PanEnd  (screenX: number, screenY: number, timeStamp: number) {}

    // --- 터치 두손가락 범위 구하기 ---
    GetDistance = (): number => {
        if(!this.pinch || this.pinch.targets.size < 2) return 0;
        const p = Array.from(this.pinch.targets.values());
        return Math.hypot(
            p[0].clientX - p[1].clientX,
            p[0].clientY - p[1].clientY,
        );
    }

    // --- 포인터 이벤트 회수(cancel, mouseup) ---
    DeletePointerEvent = (e: PointerEvent) => {
        this.parentNode.releasePointerCapture(e.pointerId);
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
}