import { IDBLib } from '../idb.library'
import { type ITab } from '../schema'

export async function newTab(db: IDBDatabase, _payload: any) 
{
    const tx = db.transaction(['tab'], 'readwrite');
    const store = {
        tab: tx.objectStore('tab'),
    };

    const id = IDBLib.CreateUUID();

    // tab 조회
    await IDBLib.Put<ITab>(store.tab, {
        id: id,
        openDiagramID: 'super',
        favorites: false,
        timestamp: Date.now(),
    });

    return id;
}

