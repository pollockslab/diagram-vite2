import { _DPR } from '@/main'

export class Snapshot {

    cav: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    size = {
        min: {
            w: 96 as number,
            h: 96 as number,   
        },
        max: {
            w: 1024 as number,
            h: 1024 as number,   
        },
    };

    constructor() {
        this.cav = document.createElement('canvas');
        this.ctx = this.cav.getContext('2d') as CanvasRenderingContext2D;
        this.Init();
    }

    Init() {
        // [Init] 캔버스 초기화 및 크기할당.
        this.cav.width = this.size.max.w * _DPR.value;
        this.cav.height = this.size.max.h * _DPR.value;

        // [Render] 좌표계 초기화 및 고해상도 설정.
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(_DPR.value, _DPR.value);
    }

    async CreateBitmap(x: number, y: number, w: number, h: number): Promise<ImageBitmap> {
        const bitmap = await createImageBitmap(this.cav, x, y, w, h);
        return bitmap;
    }
}