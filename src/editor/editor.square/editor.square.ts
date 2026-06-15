import { _MNGR } from '@/main'
import * as Diagrams from '@/diagrams/diagrams'
import * as DiagramsType from '@/diagrams/diagrams.type'

import { Popup as EnginesPopup } from '@/engines/popup/popup'
import { EditorSquarePalette } from './editor.square.palette'
import { EditorSquareTextarea } from './editor.square.textarea'
import './editor.square.css'


export class EditorSquare {
    parentNode: HTMLElement;
    popup: EnginesPopup;
    palette: EditorSquarePalette;
    textarea: EditorSquareTextarea  

    constructor(args: {parentNode: HTMLElement}) {
        this.parentNode = args.parentNode;

        this.popup = new EnginesPopup({parentNode: this.parentNode});    
        this.popup.panel.id = 'editor-square';
        this.popup.title.innerText = '편집창';
        

        // [Palette] 글꼴 및 색상지정 팔레트
        this.palette = new EditorSquarePalette({parentNode: this.popup.panel});
            
        // [Textarea] 텍스트 보기 및 수정     
        this.textarea = new EditorSquareTextarea({parentNode: this.popup.panel});

    }

    Open(diagram: DiagramsType.Instance) {
        console.log(diagram);
        // [Input] 정보 입력

        // [Popup] 팝업 오픈
        this.popup.Open();
    }

    
}