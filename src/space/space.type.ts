import * as DiagramsType from '@/diagrams/diagrams.type'


export type LayerName = 'Axis'|'Line'|'Square'|'Point';
export interface Layer {
    Axis  : DiagramsType.Instance[],
    Line  : DiagramsType.Instance[],
    Square: DiagramsType.Instance[],
    Point : DiagramsType.Instance[],
}