import { ElementCustom as E} from '@/engines/element.custom';


export class EditorSquarePalette {

    backgroundColor: ColorPicker;
    fontSize: FontSizePicker;

    constructor(args: {parentNode: HTMLElement}) {
        const div = E.create({tag: 'div', parentElement: args.parentNode});
        div.textContent = '[팔레트]';

        this.backgroundColor = new ColorPicker({parentNode: div});     
        this.fontSize = new FontSizePicker({parentNode: div});       
    }
}

// 픽커 팝업으로 띄워야되는데.
class ColorPicker {

    selected = 'black';
    div: HTMLElement;

    constructor(args: {parentNode: HTMLElement}) {
        this.div = E.create({tag: 'color-picker', parentElement: args.parentNode});
        ['black', 'white', 'red', 
         'orange', 'yellow', 'green', 
         'blue', 'navy', 'purple'].forEach((value) => {
            this.AddColor(value);
         });
    }

    AddColor(color: string) {
        const slot = E.create({tag: 'color-slot', parentElement: this.div});
        slot.style.backgroundColor = color;
        // slot.textContent = color;
        slot.addEventListener('click', (e) => {
            this.selected = color;
        });
    }
}

class FontSizePicker {

    selected = '13';
    div: HTMLElement;
    
    constructor(args: {parentNode: HTMLElement}) {

        this.div = E.create({tag: 'fontsize-picker', parentElement: args.parentNode});
        this.div.innerHTML = 
        `<input 
            type="number" 
            id="fontSizeInput" 
            class="size-input" 
            list="font-sizes" 
            min="8" 
            max="72" 
            value="16"
            placeholder="크기"
        >
        <datalist id="font-sizes">
            <option value="12"></option>
            <option value="14"></option>
            <option value="16"></option>
            <option value="18"></option>
            <option value="24"></option>
            <option value="32"></option>
            <option value="48"></option>
        </datalist>`;

    }
}