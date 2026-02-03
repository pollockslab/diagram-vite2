
import { _MAIN as _AXIS } from './axis'
import { _STOR } from '../main'

// const _DPR = Math.round(window.devicePixelRatio) || 1;

export class _MAIN extends _AXIS
{
    bgColor:string;

    constructor(args: Record<string, any>) 
    {
        super();

        // 추가 데이터 변경
        this.type = 'square';
        this.bgColor = args.bgColor || 'black';
        
        this.SetData(args);

        // 각 diagram 마다 버튼이라던가 생성하자
        // 그리고 children 에 넣어야됨
        // axis 에 안넣고 각자 필요시 넣는거? 불편해. 

        // console.log(this.children)
        this.Render();
    }

    Save()
    {

        // 1. 현재정보에서 스트리지용 데이터 추출
        // const data:IDiagram = {
        //     id: this.id as string,
        //     type: this.type,  
        //     parentID: this.parentID as string | null,
        //     tabID: string | null;
        //     zIndex: number | null;
        // };


        // 2. 거래호출
    }
    private a2 = 1;
   

    // 현재모습 캡처cav에 복사하기
    Render()
    {
        this.InitCapture();

        const cav = this._capture.cav;
        const ctx = this._capture.ctx;
        
        // 캔버스 초기화
        ctx.clearRect(0, 0, cav.width, cav.height);
        
        // 배경 그리기
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(0, 0, cav.width, cav.height);

        // 1. dpr 안한거
        const fontSize = 16;
        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'top'; // 좌표 잡기 편하게 베이스라인 설정
        
        // 20, 20 위치에 그리되 DPR 반영
        ctx.fillText(`안녕하세요${this.a2++}`, 20, 20);
        

    }

}