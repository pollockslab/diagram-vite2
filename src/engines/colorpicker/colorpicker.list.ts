import * as COLOR_LIST from './COLOR_LIST'

export class ColorPickerList {

    popupNode: HTMLElement;
    cover: HTMLElement;
    tab: HTMLElement;
    panel: HTMLElement;

    constructor(args: {popupNode: HTMLElement}) {

        this.popupNode = args.popupNode;
        
        // [Cover]
        this.cover = document.createElement('div');

        // [Tab]
        this.tab = document.createElement('div');
        this.cover.appendChild(this.tab);
        
        // [Panel]
        this.panel = document.createElement('colorpicker-list');
        this.cover.appendChild(this.panel);

        // [Add] 기본 색상 톤 (Rainbow)
        this.Add(COLOR_LIST.rainbow);
        this.Add(COLOR_LIST.pastel);
        
        // [Cover]
        this.popupNode.appendChild(this.cover);

    }

    Open() {

    }

    Close() {

    }

    Add(args: {thema?: {title: string, color: string}, colorList: string[]}) {
        // [Title]


        // [Panel]
        new ColorPickerPalette({
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
            }
        });

    }

    AddSlot(color: string) {
        const slot = document.createElement('palette-slot');
        slot.style.backgroundColor = color;

        this.cover.appendChild(slot);
    }
}