
import * as DiagramsType from './diagrams.type'

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
    
function AddChild(args: any): DiagramsType.Instance | null
{
    const targetClass = DiagramsFunction.GetClassByName(args.type);
    if (!targetClass) return null;
    
    const instance = new targetClass(args);
    instance.InitCapture(0);
    instance.Render();
    const list = this.GetChildrenByType(args.type);
    list.push(instance);
    return instance;
}
DeleteChild(dChild: DiagramsType.Instance)
{
    const list = this.GetChildrenByType(dChild.type);
    const index = list.indexOf(dChild);
    if (index > -1) {
        list.splice(index, 1);
    }
}

SetOrderChild(dChild: DiagramsType.Instance)
{
    const list = this.GetChildrenByType(dChild.type);
    const index = list.indexOf(dChild);
    if (index > -1) {
        const [dTarget] = list.splice(index, 1);
        list.push(dTarget);
    }
}

FindByID(diagramID: string): DiagramsType.Instance | null 
{
    const allLists = Object.values(this.children);

    for (const list of allLists) {
        const found = list.find((item: DiagramsType.Instance) => item.id === diagramID);
        if (found) return found;
    }
    return null;
}

FindByIDAndType(diagramID: string, diagramType: string): DiagramsType.Instance | null 
{
    const list = this.GetChildrenByType(diagramType);
    const found = list.find((item: DiagramsType.Instance) => item.id === diagramID);
    if (found) return found;

    return null;
}


