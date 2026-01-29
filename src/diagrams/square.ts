
import { _MAIN as _AXIS } from './axis'
import { type IDiagram } from '../storage/schema'
import { _STOR } from '../main'


export class _MAIN extends _AXIS
{
    bgColor:string;

    constructor(args: Record<string, any>) 
    {
        super(args);

        // 추가 데이터 변경
        this.type = 'square';
        this.bgColor = args.bgColor || 'black';
        
        this.SetData(args);
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

    // 현재모습 캡처cav에 복사하기
    Render()
    {
        const cav = this._capture.cav;
        const ctx = this._capture.ctx;
        ctx.fillStyle = this.bgColor;
        ctx.clearRect(0,0,cav.width,cav.height);
        ctx.fillRect(0,0,cav.width,cav.height)
    }
    
    Draw(ctxView:CanvasRenderingContext2D)
    {
        const cavCapture = this._capture.cav;
        ctxView.drawImage(cavCapture, this.x, this.y);
    }


}