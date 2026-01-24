import './remocon.css'
import imgSquare from './square.png'

interface IRemoteState {
    btn: HTMLDivElement|null;
    id: string|null;
    type: string|null;
    data: string|null;
}

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

         this.AddButton('square', 'toggle',"도형1", imgSquare);
    }

    AddButton(id:string, type:string, title:string, url:string)
    {
        const btn = document.createElement("div");
        btn.textContent = title;
        btn.classList.add('button');
        btn.classList.add(type);
        
        if(url) {
            btn.style.backgroundImage = `url(${url})`;
        }

        this.parentNode.appendChild(btn);

        btn.addEventListener("click", () => {
            if(this.remote.id !== null) {
                if(this.remote.type === 'toggle' && this.remote.id === id) 
                {
                    // 같은걸 연속 두번 눌렀어서 초기화
                    this.End();
                }
                else {
                    // 다른 버튼을 눌렀다
                    this.End();
                    this.Start(btn, id, type, title);
                } 
            }
            else { // 처음 누른다 설정하자
                this.Start(btn, id, type, title);
            }
            
        });
    }

    Start(btn:HTMLDivElement, id:string, type:string, title:string)
    {
        btn.classList.add('menu_select');

        this.display.text = title;
        this.remote.btn = btn;
        this.remote.id = id;
        this.remote.type = type;
        
    }

    // 작업도중이라도 호출되면 종료
    End()
    {
        if(!this.remote.btn) return;

        this.remote.btn.classList.remove('menu_select');

        this.display.text = '\n';
        this.remote.btn = null;
        this.remote.id = null;
        this.remote.type = null;
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