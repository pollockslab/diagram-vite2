import * as DiagramsType from '@/diagrams/diagrams.type'

export type ID        = null | string;
export type GridList  = Record<string, string[]>; // grid => 'x,y': 다이어그램 아이디 배열
export type LayerName = 'Axis'|'Line'|'Square'|'Point';
export interface Layer {
    Axis  : DiagramsType.Instance[],
    Line  : DiagramsType.Instance[],
    Square: DiagramsType.Instance[],
    Point : DiagramsType.Instance[],
}

export namespace serialize {
    export interface Grid {
        space_grid: {
            id   : ID;
            x1000: number;
            y1000: number;
        };
        children: {
            diagram: {
                list: string[];
            };
        };
        self: {
            diagram: {
                id: ID;
            };
        };
    }
}