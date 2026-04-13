
export class TabSingleEvent {

    private panel: HTMLElement;
    private callers: any;
    private pointers: Map<number, PointerEvent> = new Map();

    constructor(args: { 
        panel   : HTMLElement, 
        callers : {
            start    : (offsetX: number, offsetY: number, timeStamp: number) => void,
            move     : (offsetX: number, offsetY: number, timeStamp: number) => void,
            end      : (offsetX: number, offsetY: number, timeStamp: number) => void,
            cancel   : () => void,
        },
    }) {
        this.panel = args.panel;
        this.callers = args.callers;

        this.panel.addEventListener('pointerdown'   , this.OnPointerDown);
        this.panel.addEventListener('pointermove'   , this.OnPointerMove);
        this.panel.addEventListener('pointerup'     , this.OnPointerUp);
        this.panel.addEventListener('pointercancel' , this.OnPointerCancel);
        this.panel.addEventListener('contextmenu'   , this.OnContextMenu);
    }

    private OnPointerDown = (e: PointerEvent): void => {
        // [Validation] 2개 이상 무시
        if(this.pointers.size >= 1) {return;} 

        // [Capture] 포인터 캡처 시작
        this.panel.setPointerCapture(e.pointerId); 
        this.pointers.set(e.pointerId, e);

        if(this.pointers.size === 1) {
            this.callers.start(e.offsetX, e.offsetY, e.timeStamp);
        }
    }
    private OnPointerMove = (e: PointerEvent): void => {
        if(this.pointers.has(e.pointerId)) {
            // [Update] 포인터 위치 업데이트
            this.pointers.set(e.pointerId, e);
        }
        if(this.pointers.size === 1) {
            this.callers.move(e.offsetX, e.offsetY, e.timeStamp);
        }
    }
    private OnPointerUp = (e: PointerEvent): void => {
        // [Release] 포인터 캡처 종료
        this.panel.releasePointerCapture(e.pointerId);
        this.pointers.delete(e.pointerId);

        if(this.pointers.size === 0) { 
            this.callers.end(e.offsetX, e.offsetY, e.timeStamp);
        }
    }
    private OnPointerCancel = (): void => {
        // [Release] 전체 포인터 캡처 종료
        this.pointers.forEach((_, id) => this.panel.releasePointerCapture(id));
        this.pointers.clear();
        this.callers.cancel();
    }
    private OnContextMenu = (e: Event): void => {
        e.preventDefault();
    }

    public Destroy(): void {
        this.panel.removeEventListener('pointerdown'    , this.OnPointerDown);
        this.panel.removeEventListener('pointermove'    , this.OnPointerMove);
        this.panel.removeEventListener('pointerup'      , this.OnPointerUp);
        this.panel.removeEventListener('pointercancel'  , this.OnPointerCancel);
        this.panel.removeEventListener('contextmenu'    , this.OnContextMenu);
        this.pointers.clear();
    }
}