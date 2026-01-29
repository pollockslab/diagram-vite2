
export class _MAIN 
{
    type:       string = 'none';

    id:         string | null = null;
    parentID:   string | null = null;
    tabID:      string | null = null;
    zIndex:     number | null = null;

    x:          number = 0;
    y:          number = 0;
    w:          number = 0;
    h:          number = 0;
    _capture: {
        cav:    HTMLCanvasElement;
        ctx:    CanvasRenderingContext2D;
    };
    

    constructor() {
        const cav = document.createElement('canvas');
        const ctx = cav.getContext('2d') as CanvasRenderingContext2D;
        this._capture = { cav, ctx };
    }

    SetData(args: Partial<any> = {}) {
        Object.assign(this, args);

        if(args.w) this._capture.cav.width = args.w;
        if(args.h) this._capture.cav.height = args.h;
    }
}