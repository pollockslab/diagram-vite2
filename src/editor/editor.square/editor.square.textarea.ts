import { ElementCustom as E} from '@/engines/element.custom';


export class EditorSquareTextarea {

    div: HTMLElement;

    constructor(args: {parentNode: HTMLElement}) {
        this.div = E.create({tag: 'div', parentElement: args.parentNode});
        this.div.textContent = '[TEXTAREA]';
        this.div.setAttribute('contenteditable','true');

    }

    
}