import { IDBLib } from '../idb.library'

export async function saveSetting(db: IDBDatabase, {openTabID}:{openTabID: string|null}) 
{
    const tx = db.transaction(['setting'], 'readwrite');
    const store = {
        setting: tx.objectStore('setting'),
    };

    // 1. 세팅 정보 로드 (없으면 생성)
    await IDBLib.Put(store.setting, {
        id: 1, 
        openTabID
    });
}