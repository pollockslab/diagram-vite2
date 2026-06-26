import { ElementCustom as El} from '@/engines/element.custom';


export class EditorSquareTextarea {

    div: HTMLElement;

    constructor(args: {parentNode: HTMLElement}) {
        this.div = El.create({tag: 'div', parentElement: args.parentNode});
        this.div.setAttribute('contenteditable','true');


        this.div.addEventListener('input', (e: Event) => {
            const inputEvent = e as InputEvent;
           
            // [Validation] 한글 등, 글자를 아직 조합중인지 확인
            if(inputEvent.inputType !== 'insertText') {
                return;
            }
            const text = inputEvent.data;
            console.log('input:', text);
        });

        // [Composing] 한글, 한자 같은 조합형 언어 입력시 호출되는 이벤트
        this.div.addEventListener('compositionend', (e: CompositionEvent) => {

            console.log("compositionend:",e.data);

        });

        this.div.addEventListener('copy', (e: ClipboardEvent) => {
            // e.preventDefault();
            const text = document.getSelection()?.toString() ?? '';
            console.log('copy', text);
        });
        this.div.addEventListener('cut', (e: ClipboardEvent) => {
            // e.preventDefault();
            const text = document.getSelection()?.toString() ?? '';
            console.log('cut', text);
        });

         this.div.addEventListener('paste', (e: ClipboardEvent) => {
            const text = e.clipboardData?.getData('text/plain');
            console.log('paste text:', text);

        });
    }

    get innerHTML() {
        return this.div.innerHTML;
    }
    set innerHTML(data) {
        this.div.innerHTML = data;
    }
}
