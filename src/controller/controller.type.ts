import * as DiagramsType from '../diagrams/diagrams.type'


export interface OffsetPos {
    offsetX     : number;
    offsetY     : number;
    timeStamp   : number;
}

export interface Target {
    instance    : DiagramsType.Instance;
    edge        : DiagramsType.Edge | null;
    serialize   : any;
}
