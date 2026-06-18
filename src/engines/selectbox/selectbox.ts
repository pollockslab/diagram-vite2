import * as SelectboxType from './selectbox.type'
import './selectbox.css'

/**
 * [Class] Selectbox
 * @description 셀렉트/콤보박스 기능을 하는 모듈.
 * - [Type 종류]
 * -        text | number | password | select
 * @example
    const selectType = new Engines.Selectbox({
        parentNode: divMainFrame,
        type: 'select',
        datalist: [
            {key:'a', title:'옥수수', selected: true},
            {key:'b', title:'감자'},
            {key:'c', title:'고구마'}
        ],
        style: 'css-class-name',
        callers: {
            changed: (key) => {
                console.log(key);
            }
        }
    });
    const textType = new _ENGINES.Selectbox({
        parentNode: divMainFrame,
        type: 'text',
        datalist: [
            {key:'a', title:'옥수수', selected: true},
            {key:'b', title:'감자'},
            {key:'c', title:'고구마'}
        ],
        style: 'css-class-name',
        callers: {
            changed: (key) => {
                console.log(key);
            }
        }
    });
    const numberType = new Engines.Selectbox({
        parentNode: divMainFrame,
        type: 'number',
        datalist: [
            {key:'1', title:'1'},
            {key:'2', title:'2'},
            {key:'3', title:'3', selected: true}
        ],
        callers: {
            changed: OnChange,
        }
    });
    function OnChange(key: string) {
        console.log(key);
    }
 */
export class Selectbox {
    parentNode: HTMLElement;
    cover: HTMLElement;
    input: HTMLInputElement;
    datalist: HTMLElement;
    private callers: any;

    constructor(args: {
        parentNode: HTMLElement,
        popupNode: HTMLElement,
        type?: SelectboxType.Input,
        datalist?: {key: string, title: string, selected?: boolean}[],
        style?: string,
        callers?: {
            changed?: (key: string) => void, 
        },
    }) {
        this.parentNode = args.parentNode;
        this.callers = args.callers;

        // [Cover]
        this.cover = document.createElement('wd-selectbox');
        if(args.style) {
            this.cover.classList.add(args.style);
        }
        
        // [Input]
        this.input = document.createElement('input');
        this.input.setAttribute('type', args.type ?? 'text');
        if(args.type === 'select') {
            this.input.readOnly = true;
            this.input.style.cursor = 'pointer';
        }
        this.cover.appendChild(this.input);

        // [Datalist]
        this.datalist = document.createElement('wd-selectbox-datalist');
        this.datalist.classList.add('datalist-hidden');
        if(args.datalist) {
            args.datalist.forEach((value) => this.SetData(value));
        }
        document.body.appendChild(this.datalist);

        // [Cover]
        this.parentNode.appendChild(this.cover);
        

        // [Event]
        this.input.addEventListener('click', () => {
            this.datalist.classList.remove('datalist-hidden');

            // [Datalist] 위치 변경
            const rect = this.input.getBoundingClientRect();
            this.datalist.style.top = `${rect.y + rect.height}px`;
            this.datalist.style.left = `${rect.x}px`;
            this.datalist.style.width = `${rect.width}px`;
        });
        this.input.addEventListener('blur', () => {
            this.datalist.classList.add('datalist-hidden');
        });

        this.datalist.addEventListener('pointerdown', (e) => {
            this.datalist.classList.add('datalist-hidden');
            const target = e.target as HTMLElement;
            this.Select(target);

            if(target && target.tagName === 'DATALIST-DATA') {
                const key = target.getAttribute('key') ?? '';
                this.OnChanged(key);
            }
        });
    }

    get selected() {
        return this.input.getAttribute('key');
    }
    set selected(key: string | null) {
        if(!key) {return;}
        for(const child of this.datalist.children) {
            if(child.getAttribute('key') === key) {
                this.Select(child);
            }
        }
    }

    private Select(target: Element) {
        if(target && target.tagName === 'DATALIST-DATA') {
            const key = target.getAttribute('key') ?? '';
            const title = target.textContent;
            this.input.value = title ?? '';
            this.input.setAttribute('key', key);
        }
    }

    private SetData(args: {key: string, title: string, selected?: boolean}) {
        const element = document.createElement('datalist-data');
        element.setAttribute('key', args.key);
        element.textContent = args.title;
        this.datalist.appendChild(element);

        if(args.selected) {
            this.Select(element);
        }
    }

    private OnChanged = (key: string): void => {
        this.callers?.changed?.(key);
    }
}