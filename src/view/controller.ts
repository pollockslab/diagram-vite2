// 메인 앱의 _VIEW 인스턴스 타입이 필요합니다. 임시로 any 처리하거나 타입을 가져오세요.
import { _VIEW } from '../main.js';

const WHEEL_ZOOM_FACTOR = 0.001;
const PINCH_ZOOM_FACTOR = 0.002;

// 인터페이스 정의
interface PanState {
    offsetX: number;
    offsetY: number;
    xView: number;
    yView: number;
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
            this.PanStart(e.offsetX, e.offsetY);
        });

        div.addEventListener('mousemove', (e: MouseEvent) => {
            this.PanMove(e.offsetX, e.offsetY);
        });

        div.addEventListener('mouseup', (e: MouseEvent) => {
            this.PanEnd(e.offsetX, e.offsetY);
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
                this.PanStart(t.clientX, t.clientY);
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
                this.PanEnd(offsetX, offsetY);
            }
        });
    }

    private PanStart(screenX: number, screenY: number): void {
        this.down = {
            offsetX: screenX,
            offsetY: screenY,
            xView: _VIEW.x,
            yView: _VIEW.y
        };
        _VIEW.isDragging = true;
    }

    private PanMove(screenX: number, screenY: number): void {
        if (!this.down) return;

        // SpaceLine이 _VIEW에 정의되어 있어야 함
        const xRange = _VIEW.SpaceLine(screenX - this.down.offsetX);
        const yRange = _VIEW.SpaceLine(screenY - this.down.offsetY);

        _VIEW.x = this.down.xView - xRange;
        _VIEW.y = this.down.yView - yRange;

        _VIEW.isDragging = true;
    }

    private async PanEnd(screenX: number, screenY: number): Promise<void> {
        this.down = null;
        _VIEW.isDragging = false;
        // 추가 저장 로직 (리모콘 위치 저장 등) 작성 가능
        console.log(screenX, screenY);
    }
}