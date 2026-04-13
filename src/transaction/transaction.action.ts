import { _VIEW, _REMO, _LOOP } from '../main';
import { View } from '@/view/view'
import * as DiagramsType from '@/diagrams/diagrams.type'


// 역할: 셋팅값 가져오고 저장된 정보대로 맵 꾸리기
export function InitMap(): void {
    // 1. 셋팅값 가져오기
    // 2. 현 다이어그램:Space ID 확인(없으면 최상단 super)
    // 3. 기준대로 space 탭에 로드
    // 4. 메멘토 리스트를 로드할지 고민해보자( 스페이스 이동도 뒤로,앞으로 가기 되야 함)
    // 5. draw 실행
}

export function LoadMap(): void {

}


export function MoveFront(parent: View, child: DiagramsType.Instance): void {
    const type = child.axis.type;
    const list = parent.children[type]; 
    // children 오류나니까 view.grid 먼저 해결하고 넣자
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