
/**
 * [Class] _EVENT_PAN
 * @description 
 * 포인터 위치 추적 및 줌(Wheel/Pinch) 연산 엔진.
 * - **※ 자식 요소 이벤트에서 무시하고 계산.**
 * - [Pinch 구분] 
 * -        0:Hover | 1:Drag | 2:Zoom (3개 이상 무시)
 * - [Zoom 방법]
 * -        [Mouse Wheel] Front:Increase | Back:Decrease 
 * -        [Two Pinch Drag] Wide:Increase | Short:Decrease
 * @example
    class _MAIN {
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
        protected PanZoom = (size: number): void => {console.log(size);}
        protected PanStart = (offsetX: number, offsetY: number, timeStamp: number): void => {
            console.log(offsetX, offsetY, timeStamp);
        }
        protected PanMove = (screenX: number, screenY: number, timeStamp: number, isDown: boolean): void  => {
            console.log(offsetX, offsetY, timeStamp, isDown);
        }
        protected PanEnd = (screenX: number, screenY: number, timeStamp: number): void => {
            console.log(offsetX, offsetY, timeStamp);
        }
        protected PanCancel = (): void => {}
    }
 */
export class EventPan {

    private panel: HTMLDivElement;
    private callers: any;
    private pointers: Map<number, PointerEvent> = new Map();
    private zoom = { 
        distance: 0,
        size: {
            mouse: 0.001,
            touch: 0.002,
        },
    };
    private down = { count: 0 };

    constructor(args: { 
        panel   : HTMLDivElement, 
        callers : {
            zoom    : (size: number) => void,
            start   : (offsetX: number, offsetY: number, timeStamp: number) => void,
            move    : (offsetX: number, offsetY: number, timeStamp: number, isDown: boolean) => void,
            end     : (offsetX: number, offsetY: number, timeStamp: number) => void,
            cancel  : () => void,
        },
    }) {
        this.panel = args.panel;
        this.callers = args.callers;

        this.panel.addEventListener('wheel'         , this.OnWheel, { passive: false }); 
        this.panel.addEventListener('pointerdown'   , this.OnPointerDown);
        this.panel.addEventListener('pointermove'   , this.OnPointerMove);
        this.panel.addEventListener('pointerup'     , this.OnPointerUp);
        this.panel.addEventListener('pointercancel' , this.OnPointerCancel);
        this.panel.addEventListener('contextmenu'   , this.OnContextMenu);
    }

    private OnWheel = (e: WheelEvent): void => {
        e.preventDefault();
        this.callers.zoom(-e.deltaY * this.zoom.size.mouse);
    }
    private OnPointerDown = (e: PointerEvent): void => {
        // [Validation] 자식 요소 클릭 시 무시
        if(e.target !== this.panel) {return;} 
        // [Validation] 3개 이상 무시
        if(this.pointers.size >= 2) {return;} 

        // [Capture] 포인터 캡처 시작
        this.panel.setPointerCapture(e.pointerId); 
        this.pointers.set(e.pointerId, e);
        this.down.count++;

        if(this.pointers.size === 1) {
            this.callers.start(e.offsetX, e.offsetY, e.timeStamp);
        }
    }
    private OnPointerMove = (e: PointerEvent): void => {
        if(this.pointers.has(e.pointerId)) {
            // [Update] 포인터 위치 업데이트
            this.pointers.set(e.pointerId, e);
        }
        switch(this.pointers.size) {
            case 0:
                this.callers.move(e.offsetX, e.offsetY, e.timeStamp, false);
                break;
            case 1:
                this.callers.move(e.offsetX, e.offsetY, e.timeStamp, true);
                break;
            case 2:
                const values = this.pointers.values();
                const p1 = values.next().value;
                const p2 = values.next().value;
                if(!p1 || !p2) {break;}
                const dist = this.GetPointerDistance(p1, p2);
                if (this.zoom.distance === 0) {
                    this.zoom.distance = dist;
                    break; 
                }
                const deltaY = this.zoom.distance - dist;
                this.zoom.distance = dist;
                this.callers.zoom(-deltaY * this.zoom.size.touch);
                break;
        }
    }
    private OnPointerUp = (e: PointerEvent): void => {
        // [Release] 포인터 캡처 종료
        this.panel.releasePointerCapture(e.pointerId);
        this.pointers.delete(e.pointerId);
        this.zoom.distance = 0;

        if(this.pointers.size === 0) { 
            // [Validation] 두 손가락 터치 이후 END 방지
            //  ( ※아이패드에서 줌->한손가락 먼저 뗄 경우, pointerup 이벤트 동작하는 이슈 )
            if( this.down.count <= 1 ) {
                this.callers.end(e.offsetX, e.offsetY, e.timeStamp);
            }

            // [Release] 모든 손가락 떼지면 초기화
            //  ( 예시: 검지를 누른 상태로 중지만 연속 터치시 Count 증가. 두 손가락 떼면 초기화. )
            this.down.count = 0;
        }
    }
    private OnPointerCancel = (): void => {
        // [Release] 전체 포인터 캡처 종료
        this.pointers.forEach((_, id) => this.panel.releasePointerCapture(id));
        this.pointers.clear();

        this.zoom.distance = 0;
        this.down.count = 0;
        this.callers.cancel();
    }
    private OnContextMenu = (e: Event): void => {
        e.preventDefault();
    }

    private GetPointerDistance(p1: PointerEvent, p2: PointerEvent): number {
        return Math.hypot(
            p1.clientX - p2.clientX,
            p1.clientY - p2.clientY
        );
    }

    /**
     * [Convert] SetZoomSize
     * @param {mouse: 감도 수치, touch: 감도 수치} 
     * @description Zoom 감도 조절
     * @example this.SetZoomSize({ touch: 0.005 });
     */
    public SetZoomSize({mouse, touch}: { mouse?: number, touch?: number}): void {
        if (mouse !== undefined) {this.zoom.size.mouse = mouse;}
        if (touch !== undefined) {this.zoom.size.touch = touch;}
    }

    /**
     * [Release] Destroy
     * @description
     * DOM(this.panel)에 등록한 _EVENT_PAN 이벤트 리스너 전부 해제.
     * - [ 호출목적 ]
     * - 1. 자바스크립트 문법상 객체 소멸시 동작하는 함수가 없음.(예시: constructor 생성자)
     * - 2. 패널에서 _EVENT_PAN 기능을 제거하고 싶을 때.
     * - 3. 한 패널에 여러번 _EVENT_PAN 기능을 등록/삭제 할 때, 이벤트 리스너 중첩을 없애기 위해.
     * @example 
        function _MAIN(args: { panel: HTMLDivElement }) {
            let pan:_ENGINES._EVENT_PAN | null = null;
            pan = new _ENGINES._EVENT_PAN({panel, callers...});
            ...
            // ** 해제 순서 **
            pan.Destroy();
            pan = null;
        }
     */
    public Destroy(): void {
        this.panel.removeEventListener('wheel'          , this.OnWheel);
        this.panel.removeEventListener('pointerdown'    , this.OnPointerDown);
        this.panel.removeEventListener('pointermove'    , this.OnPointerMove);
        this.panel.removeEventListener('pointerup'      , this.OnPointerUp);
        this.panel.removeEventListener('pointercancel'  , this.OnPointerCancel);
        this.panel.removeEventListener('contextmenu'    , this.OnContextMenu);
        this.pointers.clear();
    }
}