
import * as DiagramsType from '../diagrams.type'
import { Diagrams } from '../diagrams'

export function GetListByType(axis: DiagramsType.Instance, type: string): DiagramsType.Instance[] {
    return axis.children[type as DiagramsType.ClassName] || [];
}

export function GetListAll(axis: DiagramsType.Instance): DiagramsType.Instance[] {
    const temps: DiagramsType.Instance[] = [];
    const allLists = Object.values(axis.children);
    for (const list of allLists) {
        for(const diagram of list) {
            temps.push(diagram);
        }
    }
    return temps;
}
    
export function Add(parent: DiagramsType.Instance, serialize: any): DiagramsType.Instance | null {
    const targetClass = Diagrams.function.GetClassByName(serialize.axis.type);
    if (!targetClass) return null;
    
    const instance = new targetClass();
    instance.SetData(serialize);
    instance.capture.InitCapture(0);
    instance.Render();
    const list = GetListByType(parent, serialize.axis.type);
    list.push(instance);
    return instance;
}

export function Delete(parent: DiagramsType.Instance, child: DiagramsType.Instance): void {
    const list = GetListByType(parent, child.axis.type);
    const index = list.indexOf(child);
    if (index > -1) {
        list.splice(index, 1);
    }
}

export function SetTopZIndex(parent: DiagramsType.Instance, child: DiagramsType.Instance): void {
    const list = GetListByType(parent, child.axis.type);
    const index = list.indexOf(child);
    if (index > -1) {
        const [target] = list.splice(index, 1);
        list.push(target);
    }
}

// FindByID(diagramID: string): DiagramsType.Instance | null 
// {
//     const allLists = Object.values(this.children);

//     for (const list of allLists) {
//         const found = list.find((item: DiagramsType.Instance) => item.id === diagramID);
//         if (found) return found;
//     }
//     return null;
// }

// FindByIDAndType(diagramID: string, diagramType: string): DiagramsType.Instance | null 
// {
//     const list = this.GetChildrenByType(diagramType);
//     const found = list.find((item: DiagramsType.Instance) => item.id === diagramID);
//     if (found) return found;

//     return null;
// }


