import { _VIEW, _REMO, _LOOP } from '../main';

/**
 * 사용처: 리모콘
 * @param type 
 * @param x 
 * @param y 
 */
async function AddDiagram(type:_DT.CHILD_NAME, x:number, y:number)
{
    // 1. 객체생성
    const instance = _VIEW.AddChild({
        type, x, y,
        
        id: crypto.randomUUID(),
        parentID: _VIEW.id,
        tabID: _VIEW.tabID,
        zIndex: Date.now(),
    });
    if(!instance) return;
    
    // 3. DB저장 -> 실패시 배열에서 빼야지
    await _STOR.Call('saveDiagram', instance.serialize);

    // 4. execute
    const memento = {
        old: null,
        now: instance,
    };
    this.Exec('AddDiagram', [memento]);
}