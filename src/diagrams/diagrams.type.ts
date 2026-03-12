import * as DiagramsConst from './diagrams.const'


export type ClassName   = keyof typeof DiagramsConst.Class;
export type Class       = typeof DiagramsConst.Class[ClassName];
export type Instance    = InstanceType<typeof DiagramsConst.Class[ClassName]>;
export type Edge        = typeof DiagramsConst.Edge[number];

export interface Capture {
    cav: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
}
export type Children = {
    [key in ClassName]: Instance[];
}

// [Schema] Storage에서 데이터를 DB에 저장할때 Type참조
export interface AxisSerialize {
    type:       ClassName,

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
export interface SquareSerialize extends AxisSerialize {
    bgColor: string,
}



