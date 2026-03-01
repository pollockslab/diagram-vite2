

import { _STOR, _CTRL, _VIEW } from '../main'
import './texteditor.css'
import { type _DT } from '../diagrams/diagrams.type'


export class _MAIN
{
    parentNode: HTMLElement;
    popup: HTMLElement;
    targetDiagram: _DT.CHILD_OBJECT | null = null;

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

    Open(txt:string)
    {
        if(_CTRL.down === undefined || _CTRL.down === null) return;
        const diagram = _CTRL.down.target as _DT.CHILD_OBJECT;

        this.parentNode.style.display = 'block';
        console.log(diagram);
        if(!diagram) return;
        this.targetDiagram = diagram;
        this.popup.textContent = txt;
    }

    Close()
    {
        this.parentNode.style.display = 'none';
        if(this.targetDiagram === null) return;
        this.targetDiagram.text = this.popup.textContent;
        this.targetDiagram.Render();
        _CTRL.loop.isDraw = true;
        _CTRL.Loop(null);
        console.log('바껴?', )
    }
}