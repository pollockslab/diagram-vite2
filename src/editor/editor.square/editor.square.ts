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
    textarea: EditorSquareTextarea;
    diagram: null | DiagramsType.Instance = null;

    constructor(args: {parentNode: HTMLElement}) {
        this.parentNode = args.parentNode;

        this.popup = new EnginesPopup({
            parentNode: this.parentNode,
            id: 'editor-square',
            title: '편집모드',
            callers: {
                save: () => this.Save(),
                close: () => this.Close(),
            },
        });    
        
        

        // [Palette] 글꼴 및 색상지정 팔레트
        this.palette = new EditorSquarePalette({parentNode: this.popup.panel});
            
        // [Textarea] 텍스트 보기 및 수정     
        this.textarea = new EditorSquareTextarea({parentNode: this.popup.panel});

    }

    Open(diagram: DiagramsType.Instance) {
        
        // [Input] 정보 입력
        this.diagram = diagram;
        if(this.diagram instanceof Diagrams.Class.Memo) {
            this.textarea.innerHTML = this.diagram.text;
        }

        // [Popup] 팝업 오픈
        this.popup.Open();
    }

    Save() {
        console.log('Save', this.textarea.innerHTML);
        // [Text] 텍스트 입력
        if(this.diagram instanceof Diagrams.Class.Memo 
            && this.diagram.text !== this.textarea.innerHTML
        ) {
            this.diagram.text = this.textarea.innerHTML;
            this.diagram.Snapshot();
            
            // [Update] 다이어그램 저장    
            _MNGR.diagram.Update(this.diagram);
            _MNGR.render.Draw();
        }

        // [Close] 팝업 닫기 
        this.popup.Close();
    }

    Close() {
        // [Close] 팝업 닫기 
        this.popup.Close();
    }
    
}