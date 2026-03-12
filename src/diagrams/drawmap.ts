
export class _MAIN 
{
    _DPR = Math.round(window.devicePixelRatio) || 1;

    // 캡처용 캔버스
    cav = document.createElement('canvas');
    ctx = this.cav.getContext('2d') as CanvasRenderingContext2D;
    diagrams = [];

    isDrag = 0; // 를 0:정지, 1:첫번째, 2:연장중
    size = {
        w: 1024,
        h: 1024,
    };

    constructor()
    {
        this.InitCanvas(this.size.w, this.size.h);
        document.body.appendChild(this.cav);
    }

    private InitCanvas(w:number, h:number)
    {
        w = w ?? this.size.w;
        h = h ?? this.size.h;

        this.cav.width = w * this._DPR;
        this.cav.height = h * this._DPR;
        this.cav.style = 
            `position:absolute; float:right; top:100px;` +
            'right: 20px; width: 200px; height: 200px;' +
            `border: 1px solid gold;`;
        
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(this._DPR, this._DPR);
    }

    Start(diagrams:[])
    {
        if(diagrams.length <= 0) return;

        const w = this.size.w * diagrams.length;
        const h = this.size.h;
        this.InitCanvas(w, h);

        this.diagrams = diagrams;
        

    }

    End()
    {
        // diagrams 초기화
        this.diagrams = [];
    }

    // 공통 리퀘스트 애니메이션
    Loop()
    {
        if(this.isDrag === 0) {
            this.isDrag = 1;

            requestAnimationFrame(() => {
                this.isDrag = 0;
                
                // 어떻게 할껀데. 
                // 렌더링을 바꿀껀데여
                // 렌더링 끝내라 신호오면
                // 캡처를 옮겨줘야지
                // dig._capture.ctx.drawImage(this.cav,)

                
            });
        }
    }
}