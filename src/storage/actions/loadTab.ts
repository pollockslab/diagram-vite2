import { IDBLib } from '../idb.library';
import { type ITab, type IDiagram } from '../schema';

export async function loadTab(
    db: IDBDatabase, 
    payload: { tabID: string | null }
): Promise<{ tab: ITab | null; diagrams: IDiagram[] | null }> 
{
    
    // 1. 방어 코드
    if (!payload.tabID) {
        return { tab: null, diagrams: null };
    }

    // 2. 읽기 전용 트랜잭션 (여러 스토어 포함)
    const tx = db.transaction(['tab', 'diagram'], 'readonly');
    const store = {
        tab: tx.objectStore('tab'),
        diagram: tx.objectStore('diagram'),
    };

    // 3. Tab 조회
    const tab = await IDBLib.Get<ITab>(store.tab, payload.tabID);
    
    if (!tab) {
        return { tab: null, diagrams: null };
    }

    // 4. 연관된 Diagram 조회
    // 팁: tab.openDiagramID가 null일 수 있으므로 IDBLib 내부에서 처리가 되어야 합니다.
    const diagrams = await IDBLib.GetByIndex<IDiagram>(
        store.diagram, 
        'byParentID', 
        tab.openDiagramID
    );

    return { tab, diagrams };
}