import { _VIEW, _REMO, _LOOP } from '../main';
import * as DiagramsType from '@diagrams/diagrams.type'


export function MoveFront(parent: DiagramsType.Instance, child: DiagramsType.Instance): void {
    const type = child.axis.type;
    const list = parent.children[type];
    const index = list.indexOf(child);
    if (index > -1) {
        const [target] = list.splice(index, 1);
        list.push(target);
    }
    // [Update] 맵 로드시 순서를 정하는 z-index 값 갱신.
    child.axis.zIndex = Date.now();
}


/**
 * 사용처: 리모콘
 * @param type 
 * @param x 
 * @param y 
 */
// async function AddDiagram(type:_DT.CHILD_NAME, x:number, y:number)
// {
//     // 1. 객체생성
//     const instance = _VIEW.AddChild({
//         type, x, y,
        
//         id: crypto.randomUUID(),
//         parentID: _VIEW.id,
//         tabID: _VIEW.tabID,
//         zIndex: Date.now(),
//     });
//     if(!instance) return;
    
//     // 3. DB저장 -> 실패시 배열에서 빼야지
//     await _STOR.Call('saveDiagram', instance.serialize);

//     // 4. execute
//     const memento = {
//         old: null,
//         now: instance,
//     };
//     this.Exec('AddDiagram', [memento]);
// }