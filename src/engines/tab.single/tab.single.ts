import { ElementCustom } from '../element.custom'
import { TabSingleEvent } from './tab.single.event'
import './tab.single.css'
type EventCall = (id: string) => boolean;

export class TabSingle {

    cover   : HTMLElement;
    header  : HTMLElement;
    panel   : HTMLElement;
    id      = {
        name: 'wd-tabsingle-',
        count: 0,
    };
    calls   = {
        select: null as null | Function,
        close: null as null | Function,
    };
    status = {
        selected: null as HTMLElement | null,
    };
    
    constructor(args: {parentElement   : HTMLDivElement,}) {
        
        this.cover  = ElementCustom.create({tag: 'wd-tabsingle', parentElement: args.parentElement});
        this.header = ElementCustom.create({tag: 'tab-header', parentElement: this.cover});
        this.panel  = ElementCustom.create({tag: 'tab-panel', parentElement: this.cover});
        const plus = ElementCustom.create({tag: 'header-plus', parentElement: this.header});
        plus.textContent = '✚';

        new TabSingleEvent({
            panel: this.header,
            callers: {
                start   : this.PanStart,
                move    : this.PanMove,
                end     : this.PanEnd,
                cancel  : this.PanCancel,
            },
        });

        // 기능: 헤더 클릭이벤트 하나 크게 생성
        this.header.addEventListener('click', (e: MouseEvent) => {
            if(!(e.target instanceof HTMLElement)) {return;}
            // 타이틀 선택
            if(e.target.matches('header-title')) {
                if(this.selected !== null) {
                    this.selected.classList.remove('title-selected');
                }
                this.selected = e.target;
                this.selected.classList.add('title-selected');

                // 타이틀 텍스트도 색상 바꾸자
                const textNode = this.selected.querySelector('title-text');
                console.log(textNode)
                if(textNode instanceof HTMLElement) {
                    textNode.classList.add('selected-color');
                }

                if(this.calls.select !== null) {
                    const bool = this.calls.select({id: e.target.id});
                }
                return;
            }
            // 타이틀 삭제
            else if(e.target.matches('title-close')) {
                const title = e.target.parentElement;
                if(this.calls.close !== null && title !== null) {
                    const bool = this.calls.close({id: title.id});
                    if(bool) {
                        if(this.selected === title) {
                            const next = title.nextElementSibling || title.previousElementSibling;
                            if(next instanceof HTMLElement) {
                                this.selected = next;
                                next.classList.add('title-selected');
                            }
                            else {
                                // 하나도 안남으면 panel.style.display = 'none' 해야되나
                            }
                        }
                        title.remove();
                    }
                }
                return;
            }
            else if(e.target.matches('header-plus')) {
                this.Add('*새 페이지', true);
            }
        });
    }

    get selected() {
        return this.status.selected;
    }
    set selected(target: HTMLElement | null) {
        if(this.status.selected !== null) {
            this.status.selected.classList.remove('title-selected');
        }
        this.status.selected = target;
        if(this.status.selected !== null) {
            this.status.selected.classList.add('title-selected');
        }
    }

    protected PanStart = (offsetX: number, offsetY: number, timeStamp: number): void => {
        console.log(offsetX, offsetY, timeStamp);
    }
    protected PanMove = (offsetX: number, offsetY: number, timeStamp: number): void  => {
        console.log(offsetX, offsetY, timeStamp);
    }
    protected PanEnd = (offsetX: number, offsetY: number, timeStamp: number): void => {
        console.log(offsetX, offsetY, timeStamp);
    }
    protected PanCancel = (): void => {}
    

    Add(content: string, selected?: boolean) {
        const title = ElementCustom.create({tag: 'header-title', parentElement: this.header});
        title.id = this.id.name + this.id.count++;
          title.title = content;
        const text = ElementCustom.create({tag: 'title-text', parentElement: title});
        text.textContent = content;
      

        const close = ElementCustom.create({tag: 'title-close', parentElement: title});
        close.textContent = 'X';

        if(selected) {
            this.selected = title;
            title.classList.add('title-selected');
        }
    }

    Selected() {

    }

    Select(call: EventCall) {
        this.calls.select = call;
    }

    Close(call: EventCall) {
        this.calls.close = call;
    }
}