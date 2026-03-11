import * as DiagramsConst from './diagrams.const'


export type ClassName = keyof typeof DiagramsConst.Class;

export type Class = typeof DiagramsConst.Class[ClassName];

export type Instance = InstanceType<typeof DiagramsConst.Class[ClassName]>;

export type Edge  = typeof DiagramsConst.Edge[number];

export interface Capture {
    cav: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
}

export interface Axis {
    type:       string,

    id:         string | null,
    parentID:   string | null,
    tabID:      string | null,
    zIndex:     number | null,

    x:          number,
    y:          number,
    w:          number,
    h:          number,

    text:       string,
}
export interface Square extends Axis {
    bgColor: string,
}



