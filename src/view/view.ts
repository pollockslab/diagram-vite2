


export class _MAIN 
{
    parentNode: HTMLElement;
    scope = {
        min:0.5, max:2, zoom:1, w:0, h:0,
        dpr: Math.round(window.devicePixelRatio) || 1,
        backgroundTileStep: 100,
    };
    x=0;
    y=0;
    isDragging = false;
    
    constructor(args: Partial<_MAIN> = {})
    {
        this.parentNode = args.parentNode || document.body;

    }

    get zoom()
    {
        return this.scope.zoom;
    }
    set zoom(size)
    {
        if(size >= this.scope.min && size <= this.scope.max) {
            this.scope.zoom = size;
        }
    }

    SpaceLine(pixel:number)
    {
        return pixel / this.zoom;
    }

}