
const ZOOM_SIZE_MOUSE = 0.001;
const ZOOM_SIZE_TOUCH = 0.002;

export class _EVENT_PAN {

    private pointers: Map<number, PointerEvent>
    private distance = 0;
    private down = {
        count: 0,
    }

    constructor(args: {
        panel: HTMLDivElement,
        callers: {
            zoom: (size: number) => void,
            start: (offsetX: number, offsetY: number, timeStamp: number) => void,
            move: (offsetX: number, offsetY: number, timeStamp: number, isDown: boolean) => void,
            end: (offsetX: number, offsetY: number, timeStamp: number) => void,
            cancel: () => void,
        }
    }) {
        
        this.pointers = new Map();
        const div = args.panel;

        // 2. Mouse Wheel
        div.addEventListener('wheel', (e: WheelEvent) => {

            e.preventDefault();
            args.callers.zoom(-e.deltaY * ZOOM_SIZE_MOUSE);
        }, { passive: false }); 

        // 3. Start
        div.addEventListener('pointerdown', (e: PointerEvent) => {

            if(e.target !== div) {return;} // 자식 클릭시 동작 안하도록 설계함(해당 클래스는, 패널 클릭 좌표를 전송하는게 목적입니다).
            if(this.pointers.size >= 2) {return;} // 3손가락 이상 터치시 무시(0:hover, 1:drag, 2:zoom).

            div.setPointerCapture(e.pointerId);
            this.pointers.set(e.pointerId, e);
            this.down.count++;

            if(this.pointers.size === 1) {
                args.callers.start(e.offsetX, e.offsetY, e.timeStamp);
            }
        });

        // 4. pointermove
        div.addEventListener('pointermove', (e: PointerEvent) => {
            
            if(this.pointers.has(e.pointerId)) {
                this.pointers.set(e.pointerId, e); // 포인터 위치 업데이트.
            }
            switch(this.pointers.size) {
                case 0:
                    args.callers.move(e.offsetX, e.offsetY, e.timeStamp, false)
                    break;
                case 1:
                    args.callers.move(e.offsetX, e.offsetY, e.timeStamp, true)
                    break;
                case 2:
                    const pts = Array.from(this.pointers.values());
                    const dist = this.GetDistance(pts[0], pts[1]);
                    if (this.distance === 0) {
                        this.distance = dist;
                        break; 
                    }
                    const deltaY = this.distance - dist;
                    this.distance = dist;
                    args.callers.zoom(-deltaY * ZOOM_SIZE_TOUCH);
                    break;
            }
        });

        // 5. pointerup
        div.addEventListener('pointerup', (e: PointerEvent) => {
            
            div.releasePointerCapture(e.pointerId);
            this.pointers.delete(e.pointerId);
            this.distance = 0;

            if(this.pointers.size === 0 && this.down.count <= 1) { // 아이패드에서는 줌할라다 엔드발생함
                this.down.count = 0;
                args.callers.end(e.offsetX, e.offsetY, e.timeStamp);
            }
        });
        // 6. pointercancel
        div.addEventListener('pointercancel', (e: PointerEvent) => {

            const keys = Array.from(this.pointers.keys());
            for(let i=0; i<keys.length; i++) {
                const key = keys[i];
                div.releasePointerCapture(key);
                this.pointers.delete(key);
            }
            this.pointers.delete(e.pointerId);
            this.distance = 0;
            this.down.count = 0;

            args.callers.cancel();
        });
    }

    private GetDistance(p1: PointerEvent, p2: PointerEvent) {

        return Math.hypot(
            p1.clientX - p2.clientX,
            p1.clientY - p2.clientY
        );
    }
}