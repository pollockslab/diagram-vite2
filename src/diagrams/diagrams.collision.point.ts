import * as DiagramsType from './diagrams.type'
import * as DiagramsConst from './diagrams.const'
import * as DiagramsChildren from './diagrams.children'

export function Check(axis: DiagramsType.Instance, x: number, y: number): boolean {
    return (
        x >= axis.x &&
        x <= axis.x + axis.w &&
        y >= axis.y &&
        y <= axis.y + axis.h
    );
}

export function GetChildFirst(axis: DiagramsType.Instance, x:number, y:number): DiagramsType.Instance | null {
    
    let order = DiagramsConst.ClassOrder.length-1;
    for(order; order >= 0; order--) {
        const type = DiagramsConst.ClassOrder[order];
        const children = DiagramsChildren.GetListByType(axis, type);

        for(let i=children.length-1; i >= 0; i--) {
            const child = children[i];
            if(Check(child, x, y)) { return child; }
        }
    }
    return null;
}
