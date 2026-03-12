import * as DiagramsType from '../diagrams/diagrams.type'


export interface Down {
    offsetX     : number;
    offsetY     : number;
    capture     : Capture | null;
    timeStamp   : number;
}

export interface Capture {
    target  : DiagramsType.Instance;
    edge    : DiagramsType.Edge | null;
    x       : number;
    y       : number;
    w       : number;
    h       : number;
}
