import { IDBLib } from '../idb.library'
import { type IDiagram } from '../schema'

export async function newDiagram(db: IDBDatabase, _payload: any): Promise<string>
{
    const id = IDBLib.CreateUUID();

    const tx = db.transaction(['diagram'], 'readwrite');
    const store = {
        diagram: tx.objectStore('diagram'),
    };

    // tab 조회
    await IDBLib.Put<IDiagram>(store.diagram, {
        id: id,
        ui: {},
        parentID: null,
        tabID: null,
    });

    return id;
}
