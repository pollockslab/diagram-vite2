import * as COLOR_LIST from './COLOR_LIST'

export class ColorPickerList {

    popupNode: HTMLElement;
    cover: HTMLElement;
    tabs: HTMLElement;
    panel: HTMLElement;
    select = {
        // 고른 정보가 들어와야함.
        // 선택한 색상 탭에서, 고른 색상에 보더처리(파란색)
        tab: null,
    };

    constructor(args: {popupNode: HTMLElement}) {

        this.popupNode = args.popupNode;
        
        // [Cover]
        this.cover = document.createElement('colorpicker-list');

        // [Panel]
        this.panel = document.createElement('list-panel');
        this.cover.appendChild(this.panel);

        // [Tab]
        this.tabs = document.createElement('list-tab');
        this.cover.appendChild(this.tabs);


        // <input type="color" value="#e66465">
        const c1 = document.createElement('input');
        c1.type = 'color';
        c1.value = 'rgb(100,100,250)';
        this.cover.appendChild(c1);


        // [Add] 기본 색상 톤 (Rainbow)
        this.Add(COLOR_LIST.rainbow);
        this.Add(COLOR_LIST.pastel);


        
        // [Cover]
        this.popupNode.appendChild(this.cover);

        // 탭 공용모듈을 만든다
        // 추가

    }

    Open() {

    }

    Close() {

    }

    private Add(args: {thema?: {title: string, color: string}, colorList: string[]}) {
        // [Tab]
        const tab = document.createElement('div');
        this.tabs.appendChild(tab);

        // [Panel]
        const panel = new ColorPickerPalette({
            parentNode: this.panel, 
            colorList: args.colorList,
        });
    }
}

class ColorPickerPalette {
    parentNode: HTMLElement;
    cover: HTMLElement;

    constructor(args: {
        parentNode: HTMLElement,
        colorList: string[],
    }) {
        this.parentNode = args.parentNode;
        
        // [Cover]
        this.cover = document.createElement('palette');

        // [List]
        args.colorList.forEach((color) => {
            this.AddSlot(color);
        });

        // [Cover]
        this.parentNode.appendChild(this.cover);

        // [Event]
        this.cover.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            if(target && target.tagName === 'PALETTE-SLOT') {
                // const key = target.getAttribute('key') ?? '';
                const key = target.style.backgroundColor;
                console.log(key);
                // 텍스트 클릭시 색상정보를 찾아서 이곳을 선택되게 할 수 없으니까
                // 이곳은 컬러피커에서 최근 누른거 중심 탭으로 향하고/
                // 따로 찾지말자. (단점:기억못함, 장점: 최근적용한 색상탭 보이는거)
            }
        });

    }

    private AddSlot(color: string) {
        const slot = document.createElement('palette-slot');
        slot.style.backgroundColor = color;

        this.cover.appendChild(slot);
    }
}