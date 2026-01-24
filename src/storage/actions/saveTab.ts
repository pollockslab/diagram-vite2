import { IDBLib } from '../idb.library'
import { type ITab } from '../schema'

export async function saveTab(db: IDBDatabase, {id, openDiagramID, favorites}:{id: string, openDiagramID: string, favorites: boolean}) 
{
    if (id === null) return;

    const tx = db.transaction(['tab'], 'readwrite');
    const store = {
        tab: tx.objectStore('tab'),
    };

    // tab 조회
    await IDBLib.Put<ITab>(store.tab, {
        id: id,
        openDiagramID: openDiagramID,
        favorites: favorites,
        timestamp: Date.now(),
    });
}
