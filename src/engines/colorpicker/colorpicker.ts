import { ColorPickerList } from './colorpicker.list';
import './colorpicker.css'

export class ColorPicker {
    parentNode: HTMLElement;
    cover: HTMLElement;
    input: HTMLElement;
    colorList: ColorPickerList;
    private callers: any;

    constructor(args: {
        parentNode: HTMLElement,
        popupNode: HTMLElement,
        style?: string,
        callers?: {
            changed?: (key: string) => void, 
        },
    }) {
        this.parentNode = args.parentNode;
        this.callers = args.callers;

        // [Cover]
        this.cover = document.createElement('wd-colorpicker');
        if(args.style) {
            this.cover.classList.add(args.style);
        }

        // [Input]
        this.input = document.createElement('colorpicker-input');
        this.cover.appendChild(this.input);

        // [ColorList]
        this.colorList = new ColorPickerList({popupNode: args.popupNode})

        // [Cover]
        this.parentNode.appendChild(this.cover);

        // [Event]
        this.input.addEventListener('click', (e) => {
            console.log('클릭');
        });
    }
}
