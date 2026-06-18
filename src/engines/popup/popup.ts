import './popup.css'

export class Popup {
    parentNode: HTMLElement;
    cover: HTMLElement;
    background: HTMLElement;
    panel: HTMLElement;
    title: HTMLElement;

    constructor(args: {parentNode: HTMLElement}) {
        this.parentNode = args.parentNode;
        this.cover = document.createElement('wd-popup');

        this.background = document.createElement('popup-background');
        this.cover.appendChild(this.background);

        this.panel = document.createElement('popup-panel');
        this.cover.appendChild(this.panel);

        this.title = document.createElement('span');
        this.title.innerText = 'Untitled';
        this.panel.appendChild(this.title);

        const btnClose = document.createElement('button');
        btnClose.innerText = '닫기';
        this.panel.appendChild(btnClose);

        // [Event]
        this.background.addEventListener('click', () => {
            this.Close();
        });
        btnClose.addEventListener('click', () => {
            this.Close();
        });
    }

    Open() {
        this.parentNode.appendChild(this.cover);
    }

    Close() {
        this.parentNode.removeChild(this.cover);
    }

}