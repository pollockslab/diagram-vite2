import './popup.css'

export class Popup {
    parentNode: HTMLElement;
    cover: HTMLElement;
    background: HTMLElement;
    panel: HTMLElement;
    title: HTMLElement;
    

    constructor(args: {
        parentNode: HTMLElement,
        id?: string,
        title?: string,
        callers?: {
            close?: () => void,
            save?: () => void,
        },
    }) {
        // [Cover]
        this.parentNode = args.parentNode;
        this.cover = document.createElement('wd-popup');

        // [Background]
        this.background = document.createElement('popup-background');
        this.background.addEventListener('click', () => {
            this.Close();
        });
        this.cover.appendChild(this.background);

        // [Panel]
        this.panel = document.createElement('popup-panel');
        if(args.id) {
            this.panel.id =  args.id;
        }
        this.cover.appendChild(this.panel);

        // [Panel-Title]
        this.title = document.createElement('span');
        this.title.innerText = args.title ?? '';
        this.panel.appendChild(this.title);

        // [Panel-close]
        if(args.callers && args.callers.close) {
            const btnClose = document.createElement('button');
            btnClose.innerText = '닫기';
            btnClose.addEventListener('click', args.callers.close);
            this.panel.appendChild(btnClose);
        }

        // [Panel-Save]
        if(args.callers && args.callers.save) {
            const btnSave = document.createElement('button');
            btnSave.innerText = '저장';
            btnSave.addEventListener('click', args.callers.save);
            this.panel.appendChild(btnSave);
        }
    }

    Open() {
        this.parentNode.appendChild(this.cover);
    }

    Close() {
        this.parentNode.removeChild(this.cover);
    }

}