import { ElementCustom as E} from '@/engines/element.custom'
import { ColorPicker } from '@/engines/colorpicker/colorpicker';
import { Selectbox } from '@/engines/selectbox/selectbox'


export class EditorSquarePalette {

    backgroundColor: ColorPicker;
    fontSize: Selectbox;

    constructor(args: {parentNode: HTMLElement}) {
        const div = E.create({tag: 'div', parentElement: args.parentNode});
        // div.textContent = '[팔레트]';

        this.backgroundColor = new ColorPicker({
            parentNode: div,
            popupNode: args.parentNode,
        });     
        const a1 = E.create({'tag': 'a', parentElement: div});
        a1.textContent = 'px:'
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
    }
}

// // 픽커 팝업으로 띄워야되는데.
// class ColorPicker {

//     selected = 'black';
//     div: HTMLElement;

//     constructor(args: {parentNode: HTMLElement}) {
//         this.div = E.create({tag: 'color-picker', parentElement: args.parentNode});
//         ['black', 'white', 'red', 
//          'orange', 'yellow', 'green', 
//          'blue', 'navy', 'purple'].forEach((value) => {
//             this.AddColor(value);
//          });
//     }

//     AddColor(color: string) {
//         const slot = E.create({tag: 'color-slot', parentElement: this.div});
//         slot.style.backgroundColor = color;
//         // slot.textContent = color;
//         slot.addEventListener('click', (e) => {
//             this.selected = color;
//         });
//     }
// }
