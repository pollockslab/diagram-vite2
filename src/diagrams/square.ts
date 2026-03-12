
import * as DiagramsType from './diagrams.type'
import { Axis } from './axis'
import { _VIEW } from '../main'

export class Square extends Axis
{
    type:       DiagramsType.ClassName = 'square';
    bgColor:    string = 'orange';
    text:       string = '반가워요123';

    constructor(args: Record<string, any>) 
    {
        super();
        this.SetData(args);
    }

    get serialize(): DiagramsType.SquareSerialize
    {
        return {
            ...super.serialize,
            bgColor: this.bgColor,
        };
    }


    private a2 = 1;
   

    // 현재모습 캡처cav에 복사하기
    Render()
    {
        const ctx = this._capture.ctx;
        const x = 0;
        const y = 0;
        
        ctx.save();
        // 캔버스 초기화
        ctx.clearRect(x, y, this.w, this.h);
        
        // 그림자 설정

        // 배경 그리기
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(x, y, this.w, this.h);

        // 1. dpr 안한거
        const fontSize = 16;
        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'top'; // 좌표 잡기 편하게 베이스라인 설정
        
        // 20, 20 위치에 그리되 DPR 반영
        ctx.fillText(`글: ${this.text}${this.a2++}`, x+20, y+20);
        
        ctx.restore();
    }

}
