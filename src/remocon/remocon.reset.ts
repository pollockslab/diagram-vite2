
export class RemoconReset {
    constructor(args: {parentNode: HTMLElement, panel: HTMLElement}) {
        const button = document.createElement("div");
        button.id = 'remocon-reset';
        args.parentNode.appendChild(button);

        button.onclick = () => {
            args.panel.style.left = '10px';
            args.panel.style.top = '30px';
        };
    }
}