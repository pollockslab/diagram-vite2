import * as DiagramsType from '../diagrams/diagrams.type'


export interface Down {
    target: DiagramsType.Instance;
    offsetX: number;
    offsetY: number;
    x: number;
    y: number;
    w: number;
    h: number;
    timeStamp: number;
    edge: DiagramsType.Edge | null;
}
export interface Move {
    x: number;
    y: number;
    isLoop: boolean;
}


