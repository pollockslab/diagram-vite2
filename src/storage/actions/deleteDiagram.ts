import { IDBLib } from '../idb.library'
import { type IDiagram } from '../schema'

export async function deleteDiagram(db: IDBDatabase, payload:IDiagram): Promise<void>
{
    if(payload.id === null) return;

    const tx = db.transaction(['diagram'], 'readwrite');
    const store = {
        diagram: tx.objectStore('diagram'),
    };

    // tab 조회
    await IDBLib.Del(store.diagram, payload.id);
}
