import * as DiagramsType from '../diagrams/diagrams.type'


export interface Down {
    offsetX     : number;
    offsetY     : number;
    target      : Target;
    timeStamp   : number;
}

export interface Target {
    instance    : DiagramsType.Instance;
    edge        : DiagramsType.Edge | null;
    serialize   : any;
}
