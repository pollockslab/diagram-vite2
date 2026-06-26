
import { _DPR, _SNAP } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'
import { Square } from '@/diagrams/core/square'

export class Memo extends Square implements DiagramsType.serialize.modules.square.Memo {
    memo = {
        backgroundColor : 'orange',
        text            : '',
    };

    constructor() {super();}

    get serialize(): DiagramsType.serialize.modules.square.Memo {
        return {
            ...super.serialize,
            memo: {
                backgroundColor : this.memo.backgroundColor,
                text            : this.memo.text,
            },
        };
    }

    get backgroundColor() {
        return this.memo.backgroundColor;
    }
    set backgroundColor(color: string) {
        this.memo.backgroundColor = color;
    }
    get text() {
        return this.memo.text;
    }
    set text(data: string) {
        this.memo.text = data;
    }

    async Snapshot() {
        const ctx = _SNAP.ctx;
        const fontSize = 16;
        const guideLine = {x:20, y:20}
        
        ctx.clearRect(0, 0, this.w, this.h);
        
        ctx.save();

        // [Shadow]
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // [Panel]
        ctx.fillStyle = this.memo.backgroundColor;
        ctx.fillRect(4, 4, this.w-8, this.h-8);

        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'top';
        
        // 임시로 분리해보자
        // 규칙1: <div>문장</div>
        // 규칙2: <div><br></div> 줄내리기
        const templete = document.createElement('templete');
        templete.innerHTML = this.text;
        let caret = {
            x: guideLine.x,
            y: guideLine.y,
        };
        for(const node of templete.childNodes) {
            // console.log(node);
            let text = '';
            caret.y += guideLine.y;
            if(node.nodeType === Node.TEXT_NODE) {
                text = node.textContent ?? '';
            }
            else if(node.nodeType === Node.ELEMENT_NODE) {
                const first = node.firstChild;
                if(first instanceof HTMLBRElement) {
                    // 일반텍스트
                }
                else if(first instanceof Text) {
                    // 엘리먼트
                    text = first.textContent ?? '';
                }
            }
            // 가로길이를 재서 텍스트 넘어가면 아래로 내려야함(div 처럼)
            ctx.fillText(text, caret.x, caret.y);        

        }

        // ctx.fillText(`${this.memo.text}`, guideLine.x, guideLine.y);
        ctx.restore();

        // [Copy]
        this.imageBitmap = await _SNAP.CreateBitmap(0, 0, this.w*_DPR.value, this.h*_DPR.value);
    }
}
