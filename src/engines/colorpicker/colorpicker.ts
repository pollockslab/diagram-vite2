import { ColorPickerDatalist } from './colorpicker.datalist';
import './colorpicker.css'

export class ColorPicker {
    parentNode: HTMLElement;
    cover: HTMLElement;
    input: HTMLInputElement;

    constructor(args: {
        parentNode: HTMLElement,
        style?: string,
        colorList?: string[],
        callers?: {
            changed?: (color: string) => void, 
        },
    }) {
        this.parentNode = args.parentNode;

        // [Cover]
        this.cover = document.createElement('wd-colorpicker');
        if(args.style) {
            this.cover.classList.add(args.style);
        }

        // [Input]
        this.input = document.createElement('input');
        this.input.type = 'color';
        this.cover.appendChild(this.input);

        // [Datalist]
        if(args.colorList) {
            new ColorPickerDatalist({
                parentNode: this.parentNode,
                inputNode: this.input,
                colorList: args.colorList
            });
        }

        // [Cover]
        this.parentNode.appendChild(this.cover);

        // [Event]
        this.input.addEventListener('change', () => {
            const color = this.input.value;
            if(color) {
                args.callers?.changed?.(color);
            }
        });
    }
}
