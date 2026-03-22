import { Diagrams } from '@diagrams/diagrams'
import * as DiagramsType from '@diagrams/diagrams.type'


export function Check(axis: DiagramsType.Instance, x: number, y: number): boolean {
    return (
        x >= axis.x &&
        x <= axis.x + axis.w &&
        y >= axis.y &&
        y <= axis.y + axis.h
    );
}

export function FindFront(parent: DiagramsType.Instance, x:number, y:number): DiagramsType.Instance | null {
    
    let order = Diagrams.const.ClassOrder.length-1;
    for(order; order >= 0; order--) {
        const type = Diagrams.const.ClassOrder[order];
        const children = parent.children[type];

        for(let i=children.length-1; i >= 0; i--) {
            const child = children[i];
            if(Check(child, x, y)) { return child; }
        }
    }
    return null;
}


