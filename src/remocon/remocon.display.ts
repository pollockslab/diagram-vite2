
export class RemoconDisplay {

    parentNode: HTMLElement;
    div: HTMLDivElement;
    down: {x: number, y: number, left: number, top: number} | null = null;

    constructor(args: {parentNode: HTMLElement}) {
        this.parentNode = args.parentNode;
 
        const div = document.createElement("div");
        this.div = div;
        div.classList.add('display');
        div.innerText = '\n';
        this.parentNode.appendChild(div);
        
        div.addEventListener("pointerdown", e => {
            div.setPointerCapture(e.pointerId);
            this.down = {
                x: e.clientX,
                y: e.clientY,
                left: this.parentNode.offsetLeft,
                top: this.parentNode.offsetTop
            };
        });
        div.addEventListener("pointermove", e => {
            if(!this.down) return;

            const deltaX = e.clientX - this.down.x;
            const deltaY = e.clientY - this.down.y;

            const nextX = this.down.left + deltaX;
            const nextY = this.down.top + deltaY;

            this.parentNode.style.left = `${nextX}px`;
            this.parentNode.style.top = `${nextY}px`;
        });
        const EndPoint = (e:PointerEvent) => {
            this.down = null;
            div.releasePointerCapture(e.pointerId);
        };
        div.addEventListener("pointerup", EndPoint);
        div.addEventListener("pointercancel", EndPoint);
    }

    set text(txt: string) {
        this.div.innerText = txt;
    }
}