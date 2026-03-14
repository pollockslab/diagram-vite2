import * as DiagramsConst from './diagrams.const'


export type Edge        = typeof DiagramsConst.Edge[number];

export type ClassName   = keyof typeof DiagramsConst.Class;
export type Class       = typeof DiagramsConst.Class[ClassName];
export type Instance    = InstanceType< typeof DiagramsConst.Class[ClassName] >;
export type Children    = { [key in ClassName]: Instance[]; }

// [Schema] Storage에서 데이터를 DB에 저장할때 Type참조
export namespace serialize {
    // [filter] 기본정보
    export interface Axis {
        tab: {
            id: string | null,
        },
        parent: {
            id: string | null,
        },
        axis: {
            type    : ClassName,
            id      : string | null,
            zIndex  : number | null,
            x       : number,
            y       : number,
            w       : number,
            h       : number,
        },
    }
    export interface Square extends serialize.Axis{
        square: {
            backgroundColor : string,
            text            : string,
        },
    }
}


