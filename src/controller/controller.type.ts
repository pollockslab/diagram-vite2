import * as DiagramsType from '../diagrams/diagrams.type'


export interface Down {
    offsetX     : number;
    offsetY     : number;
    target      : Target;
    timeStamp   : number;
}

export interface Target {
    diagram     : DiagramsType.Instance;
    edge        : DiagramsType.Edge | null;
    x           : number;
    y           : number;
    w           : number;
    h           : number;
    serialize   : DiagramsType.serialize.Axis;
}
