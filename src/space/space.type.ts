import * as DiagramsType from '@/diagrams/diagrams.type'


export type LayerName = 'Axis'|'Line'|'Square'|'Point';
export interface Layer {
    Axis  : DiagramsType.Instance[],
    Line  : DiagramsType.Instance[],
    Square: DiagramsType.Instance[],
    Point : DiagramsType.Instance[],
}

export interface Edge {
    arrow: EdgeArrow,
    cursor: EdgeCursor,
}
export type EdgeArrow = 
    'e'|'w'|'s'|'n'|        // 동, 서, 남, 북
    'es'|'en'|'ws'|'wn';    // 동남, 동북, 서남, 서북
      
export type EdgeCursor = 
    // 단방향 (상하좌우)
    'ew-resize'|
    'ew-resize'|
    'ns-resize'|
    'ns-resize'|
        
    // 대각선 방향 (북동-남서, 북서-남동)
    'nwse-resize'|
    'nesw-resize'|
    'nesw-resize'|
    'nwse-resize';
