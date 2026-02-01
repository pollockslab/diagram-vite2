

import { _STOR } from '../main'


export class _MAIN
{
    parentNode: HTMLElement;
    popup: HTMLElement;
    constructor(args: Partial<_MAIN> = {})
    {
        this.parentNode = args.parentNode || document.body;

        // 백그라운드.

        this.popup = document.createElement('div');
        this.popup.id = 'editor_text';
        this.parentNode.appendChild(this.popup);

    }

    SetData()
    {

    }

    Open()
    {

    }

    Close()
    {

    }
}