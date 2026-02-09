

import { _STOR } from '../main'
import './texteditor.css'


export class _MAIN
{
    parentNode: HTMLElement;
    popup: HTMLElement;
    constructor(args: Partial<_MAIN> = {})
    {
        // 백그라운드.
        this.parentNode = args.parentNode || document.body;
        this.parentNode.addEventListener('click', (e) =>
        {
            if(e.target !== this.parentNode) return;
            this.Close();
        });
        

        this.popup = document.createElement('div');
        this.popup.classList.add('popup');
        this.popup.contentEditable = 'true';
        
        this.parentNode.appendChild(this.popup);

    }

    SetData(args: Record<string, any>)
    {
        console.log(args)
    }

    Open()
    {
        this.parentNode.style.display = 'block';
    }

    Close()
    {
        this.parentNode.style.display = 'none';
    }
}