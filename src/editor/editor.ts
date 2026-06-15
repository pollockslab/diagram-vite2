import { Popup as EnginesPopup } from '@/engines/popup/popup'
import { EditorUI } from './editor.ui';

export class Editor {
    parentNode: HTMLElement;
    popup: EnginesPopup;
    ui: EditorUI;

    // 텍스트 에디터
    // 그림 에디터
    // 사운드 에디터

    constructor(args: {parentNode: HTMLElement}) {
        this.parentNode = args.parentNode;
        this.popup = new EnginesPopup({parentNode: args.parentNode});    
        this.popup.title.innerText = '환경설정';

        this.ui = new EditorUI({parentNode: this.popup.panel});
    }

    Open() {
        this.popup.Open();
    }
}