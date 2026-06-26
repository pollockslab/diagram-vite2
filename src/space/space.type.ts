import * as DiagramsType from '@/diagrams/diagrams.type'


export type LayerName = 'Axis'|'Line'|'Square'|'Point';
export interface Layer {
    Axis  : DiagramsType.Instance[],
    Line  : DiagramsType.Instance[],
    Square: DiagramsType.Instance[],
    Point : DiagramsType.Instance[],
}

export type EdgeArrow = 
    'e'|'w'|'s'|'n'|        // 동, 서, 남, 북
    'es'|'en'|'ws'|'wn';    // 동남, 동북, 서남, 서북
export type EdgeCursor = 
    'ns'|'ew'|              // 남서, 동서
    'nesw'|'nwse';          // 북동-남서, 북서-남동   
