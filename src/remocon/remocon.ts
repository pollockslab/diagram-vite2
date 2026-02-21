import './remocon.css'
import imgSquare from './square.png'
import imgPointer from './remocon-pointer.png'
import imgfavorate from './favorite.png'
import imgSetting from './setting.png'
import imgPicture from './picture.png'
import imgRemove from './remove.png'
import imgImageDownload from './imageDownload.png'
import imgMultiSelect from './remocon-multiselect.png'
import imgEditorText from './remocon-editortext.png'

import imgUndo from './remocon-undo.png'
import imgRedo from './remocon-redo.png'

import { _VIEW } from '../main'

interface IRemoteState {
    btn: HTMLDivElement|null;
    id: string|null;
    type: string|null;
    data: string|null;
}
// toggle: 화면 클릭으로 액션실행 | active: 즉시실행후 pointer | passive: 연속실행
// 이라고 했는데 active면 굳이 뭔갈 바꿀필욘 없나

// type TButtonType = 'toggle' | 'active' | 'passive'; // default:pointer

export class _MAIN 
{
    parentNode: HTMLElement;
    display: _DISPLAY;
    remote:IRemoteState = {
        btn: null,
        id: null,
        type: null,
        data: null,
    };


    constructor(args: Partial<_MAIN> = {})
    {
        this.parentNode = args.parentNode || document.body;
 
        this.display = new _DISPLAY({parentNode: this.parentNode});
        
        this.AddText('Pointer');
        this.AddButton('pointer', 'toggle',"포인터", imgPointer);
        this.AddButton('multiselect', 'toggle',"그룹선택", imgMultiSelect);
        this.AddButton('editortext', 'toggle',"텍스트편집", imgEditorText);

        // 여기에 라인을 추가해서 넣자
        this.AddLine();
        this.AddText('Add Diagram');
        this.AddButton('square', 'toggle',"도형1", imgSquare);
        this.AddButton('picture', 'toggle',"그림도형", imgPicture);

        this.AddLine();
        this.AddText('Files & System');
        this.AddButton('favorate', 'action',"즐겨찾기", imgfavorate);
        this.AddButton('setting', 'action',"환경설정", imgSetting);
        this.AddButton('remove', 'toggle',"도형삭제", imgRemove);
        this.AddButton('imagedownload', 'action',"화면캡처", imgImageDownload);

        this.AddLine();
        this.AddText('Undo & Redo');
        this.AddButton('undo', 'action',"작업 복원하기(뒤)", imgUndo);
        this.AddButton('redo', 'action',"작업 복원하기(앞)", imgRedo);
    }

    AddLine()
    {
        const line = document.createElement("hr");
        line.classList.add('line');
        this.parentNode.appendChild(line);
    }

    AddText(text:string)
    {
        const small = document.createElement("small");
        small.classList.add('small');
        small.innerText = text;
        this.parentNode.appendChild(small);
    }

    AddButton(id:string, type:string, title:string, url:string|null)
    {
        const btn = document.createElement("div");
        // btn.textContent = title;
        btn.classList.add('button');
        btn.classList.add(type);
        
        if(url) {
            btn.style.backgroundImage = `url(${url})`;
        }

        this.parentNode.appendChild(btn);

        btn.addEventListener("click", () => {
           if (this.remote.id !== null) {
                if (this.remote.type === 'toggle' && this.remote.id === id) {
                    this.End(); // 같은 토글 버튼 -> 취소
                } else {
                    this.End(); // 다른 버튼 -> 이전 상태 초기화
                    this.Start(btn, id, type, title, url);
                    if (type === 'action') this.Action(); // 액션은 즉시 실행
                }
            } else {
                this.Start(btn, id, type, title, url);
                if (type === 'action') this.Action(); // 액션은 즉시 실행
            }
        });
    }

    Start(btn:HTMLDivElement, id:string, type:string, title:string, url:string|null)
    {
        btn.classList.add('menu_select');

        this.display.text = title;
        this.remote.btn = btn;
        this.remote.id = id;
        this.remote.type = type;

        // 전역에 스타일을 강제 고정하는 전문가적 자바스크립트 한 줄
        document.body.style.setProperty('cursor', `url(${url}), auto`, 'important');
        
    }

    Action(args: {x?: number, y?: number} = {})
    {
        // 선택된 버튼이 없으면 리턴
        // if(!this.remote.id) return;

        switch(this.remote.id)
        {
            case 'square':
                console.log(`[설치] 좌표 (${args.x}, ${args.y}) 에 사각형 생성`);
                // 여기서 실제 _VIEW에 사각형을 추가하는 로직 호출
                // const dSquare = _VIEW.AddChild({type:'square', x:args.x, y:args.y, w:100, h:100, bgColor:'red', id:crypto.randomUUID()});
                break;
            case 'favorate':
                console.log('즐겨찾기 실행');
                break;
            case 'imagedownload':
                console.log('화면 캡처 시작');
                break;
            case 'editortext':
                break;
            case 'pointer':
            default:
                console.log('실행:', this.remote.id);

                break;
        }

        // 작업 완료 후 UI를 원래대로 (버튼 올라옴)
        this.End();
    }

    // 작업도중이라도 호출되면 종료
    End()
    {
        // // 선택된 버튼이 없으면 리턴
        if(!this.remote.btn) return;

        // 초기화
        this.remote.btn.classList.remove('menu_select');
        this.display.text = '\n';
        this.remote.btn = null;
        this.remote.id = null;
        this.remote.type = null;

        document.body.style.removeProperty('cursor');
    }
}


class _DISPLAY 
{
    parentNode: HTMLElement;
    div: HTMLDivElement;
    down:{x: number, y: number} | null = null;

    constructor(args: Partial<_MAIN> = {})
    {
        this.parentNode = args.parentNode || document.body;
 
        const div = document.createElement("div");
        this.div = div;
        div.classList.add('display');
        div.innerText = '\n';
        this.parentNode.appendChild(div);
        
        div.addEventListener("pointerdown", e => {
            div.setPointerCapture(e.pointerId);
            this.down = {x: e.offsetX, y: e.offsetY};
        });
        div.addEventListener("pointermove", e => {
            if(!this.down) return;

            const x = e.clientX - this.down.x;
            const y = e.clientY - this.down.y;

            this.parentNode.style.left = `${x}px`;
            this.parentNode.style.top = `${y}px`;
        });
        const STOP_POINTER = (e:PointerEvent) =>
        {
            this.down = null;
            div.releasePointerCapture(e.pointerId);
        };
        div.addEventListener("pointerup", STOP_POINTER);
        div.addEventListener("pointercancel", STOP_POINTER);
       
    }

    set text(txt:string)
    {
        this.div.innerText = txt;
    }
}