import { IDBLib } from '../idb.library'
import { type ISetting } from '../schema'

export async function loadSetting(db: IDBDatabase, {}) 
{
    const tx = db.transaction(['tab', 'log', 'setting'], 'readwrite');
    const store = {
        tab: tx.objectStore('tab'),
        log: tx.objectStore('log'),
        setting: tx.objectStore('setting'),
    };

    // 1. 세팅 정보 로드 (없으면 생성)
    let setting = await IDBLib.Get<ISetting>(store.setting, 1);
    
    if (!setting) {
        await IDBLib.Put(store.log, {
            id: 0, // autoIncrement인 경우
            code: 'tx', 
            ext: 'loadSetting. first enter', 
            timestamp: Date.now()
        });

        setting = { id: 1, openTabID: null }; // 초기 객체 생성
        await IDBLib.Put(store.setting, setting);
    }

    // 2. 연결된 탭이 유효한지 검사
    const currentTabID = setting.openTabID;
    let isTabValid = false;

    // 키가 유효할 때만 Get 호출 (null/undefined 에러 방지)
    if (currentTabID) {
        const tab = await IDBLib.Get(store.tab, currentTabID);
        if (tab) isTabValid = true;
    }

    // 3. 탭이 없거나 유효하지 않으면 새로 생성
    if (!isTabValid) {
        const newTabID = IDBLib.CreateUUID();
        
        // 새 탭 저장
        await IDBLib.Put(store.tab, {
            id: newTabID, 
            openDiagramID: 'super',
            favorites: false, // 스키마 정의에 맞춰 boolean으로 수정
            timestamp: Date.now()
        });

        // 세팅 정보 업데이트
        setting.openTabID = newTabID;
        await IDBLib.Put(store.setting, setting);
    }

    // 최종적으로 보정된 setting 반환
    return setting;
}