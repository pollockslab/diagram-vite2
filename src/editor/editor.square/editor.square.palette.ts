import { ElementCustom as E} from '@/engines/element.custom'
import { ColorPicker } from '@/engines/colorpicker/colorpicker';
import { Selectbox } from '@/engines/selectbox/selectbox'
import * as COLOR_LIST from '../COLOR_LIST'


export class EditorSquarePalette {

    backgroundColor: ColorPicker;
    fontSize: Selectbox;
    color: ColorPicker;
    bold: HTMLElement;
    italic: HTMLElement;

    constructor(args: {parentNode: HTMLElement}) {
        const div = E.create({tag: 'square-palette', parentElement: args.parentNode});
        
        // [BackgroundColor]
        E.create({'tag': 'a', parentElement: div, textContent: 'Back:'});
        this.backgroundColor = new ColorPicker({
            parentNode: div,
            colorList: [...COLOR_LIST.rainbow.colorList, ...COLOR_LIST.pastel.colorList,],
            callers: {
                changed(color: string) {
                    console.log(color);
                }
            }
        });

        // [FontSize]
        E.create({'tag': 'a', parentElement: div, textContent: 'Size:'});
        this.fontSize = new Selectbox({
            parentNode: div,
            popupNode: args.parentNode,
            type: 'number',
            datalist: [
                {key:'8', title:'8'},
                {key:'9', title:'9'},
                {key:'10', title:'10'},
                {key:'11', title:'11', selected: true},
                {key:'15', title:'15'},
                {key:'18', title:'18'},
                {key:'24', title:'24'},
                {key:'32', title:'32'},
                {key:'48', title:'48'},
                {key:'72', title:'72'},
            ],
            style: 'font-size1',
            callers: {
                changed: (key: string) => {
                    console.log(key);
                },
            }
        }); 

        // [Color]
        E.create({'tag': 'a', parentElement: div, textContent: 'Color:'});
        this.color = new ColorPicker({
            parentNode: div,
            colorList: [...COLOR_LIST.rainbow.colorList, ...COLOR_LIST.pastel.colorList,],
            callers: {
                changed(color: string) {
                    console.log(color);
                }
            }
        });

        // [Bold]
        E.create({'tag': 'a', parentElement: div, textContent: 'Bold:'});
        this.bold = E.create({'tag': 'input', type:'checkbox', parentElement: div});

        // [Italic]
        E.create({'tag': 'a', parentElement: div, textContent: 'Italic:'});
        this.italic = E.create({'tag': 'input', type:'checkbox', parentElement: div});
    }
}
