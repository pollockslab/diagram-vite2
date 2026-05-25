import { _REMO, _MNGR } from '@/main'
import * as RemoconType from './remocon.type'

// Pointer
import imgPointer from './img/pointer.png'
import imgMultiSelect from './img/multiselect.png'
import imgEditorText from './img/editortext.png'
import imgPointerSpace from './img/remocon-pointer-space.png'
// import imgPointerDelete from './img/remocon-pointer-delete.png'

// Add Diagram
import imgSquare from './img/square.png'
import imgPicture from './img/picture.png'

// Files & System
import imgfavorate from './img/favorite.png'
import imgSetting from './img/setting.png'
import imgRemove from './img/remove.png'
import imgImageDownload from './img/imageDownload.png'

// Copy & Paste
// Undo & Redo
import imgUndo from './img/undo.png'
import imgRedo from './img/redo.png'


export class RemoconButtons {

    panel: HTMLElement;
    buttons: Record<string, RemoconType.ButtonInfo> = {};
    selected: RemoconType.ButtonInfo;

    constructor(args: {parentNode: HTMLElement}) {

        this.panel = args.parentNode;

        this.AddText('Pointer');
        this.selected = this.AddButton('pointer', 'passive',"포인터", imgPointer);
        this.AddButton('multiselect', 'passive',"다중선택", imgMultiSelect);
        this.AddButton('editortext', 'passive',"텍스트편집", imgEditorText);
        this.AddButton('space', 'passive',"스페이스", imgPointerSpace);
        this.AddButton('pointerdelete', 'passive',"도형삭제", imgRemove);

        this.AddLine();
        this.AddText('Add Diagram');
        this.AddButton('square', 'passive',"사각형 추가", imgSquare);
        this.AddButton('picture', 'passive',"그림 추가", imgPicture);

        this.AddLine();
        this.AddText('Files & System');
        this.AddButton('favorate', 'toggle',"즐겨찾기", imgfavorate);
        this.AddButton('setting', 'active',"환경설정", imgSetting);
        this.AddButton('imagedownload', 'active',"화면캡처", imgImageDownload);

        this.AddLine();
        this.AddText('Copy & Paste');

        this.AddLine();
        this.AddText('Undo & Redo');
        this.AddButton('undo', 'active',"뒤로 복원하기(Ctrl+Z)", imgUndo);
        this.AddButton('redo', 'active',"앞으로 복원하기(Ctrl+Y)", imgRedo);
    } 
    
    AddLine() {
        const line = document.createElement("hr");
        line.classList.add('line');
        this.panel.appendChild(line);
    }

    AddText(text:string) {
        const small = document.createElement("small");
        small.classList.add('text');
        small.innerText = text;
        this.panel.appendChild(small);
    }
    
    /**
     * [Function] 버튼 생성하는 함수.
     * @param id 버튼 아이디
     * @param type 버튼의 종류  
     * ※ passive 버튼은 동시에 한개만 선택되어 있을 수 있음.
     * 1. passive: 선택이후 지속적으로 작업 (예: pointer)
     * 2. active: 버튼 누를시 바로 실행 (예: Undo, Redo)
     * 3. toggle: 활성/비활성화 작업 (예: 즐겨찾기 팝업 열기, 경로 검색팝업 열기)
     * 4. 비활성화 기능: Undo, Redo 버튼같은 경우 돌아갈 작업이 없으면 비활성화.
     * @param title 버튼 문구
     * @param url 이미지 경로
     */
    AddButton(id: string, type: RemoconType.ButtonType, title: string, url: string) {
        // [Create] 버튼 생성
        const button = document.createElement("div");
        button.title = title;
        button.classList.add('button');
        button.classList.add(type);
        button.style.backgroundImage = `url(${url})`;
        this.panel.appendChild(button);

        // [Save] 버튼 객체 목록에 저장
        this.buttons[id] = {id, button, type, title};

        // [Event] 버튼 클릭 설정
        button.addEventListener("click", () => {
            switch(type) {
                case 'passive': {
                    if(this.selected.id !== id) {
                        _REMO.selected = id;
                        _MNGR.remocon.Action(id);
                    }
                    break;
                }
                case 'active': {
                    _MNGR.remocon.Action(id);
                    break;
                }
                case 'toggle': {
                    button.classList.toggle('button-select');
                    if (button.classList.contains('button-select')) {
                        _MNGR.remocon.Action(id);
                    }
                    break;
                }
            }
        });
        return this.buttons[id];
    }

    // type 이 passive 인 버튼만 선택 가능함.
    Select(id: string) {
        const old = this.selected;
        let now = this.buttons[id];

        if(now.type !== 'passive') {
            now = this.buttons['pointer'];
        }

        old?.button.classList.remove('button-select');
        now?.button.classList.add('button-select');

        this.selected = now;
    }
    
}