import { _SCHEMA } from "./schema";
import { _ACTION_LIST } from './actions/_ACTION_LIST'

type TranListType = typeof _ACTION_LIST;
type TranType = keyof TranListType;

const dbPromise = _OPEN_IDB();

self.onmessage = async (e: MessageEvent) => 
{
    const { id, type, payload } = e.data as { id: string; type: TranType; payload: any };

    try {
        const db = await dbPromise;
        const actionFunc = _ACTION_LIST[type];
        if (!actionFunc) {
            throw new Error(`Unknown transaction type: ${type}`);
        }

        const result = await actionFunc(db as IDBDatabase, payload as any);

        self.postMessage({ id, ok: true, result });
    }
    catch (err) {
        self.postMessage({ 
            id, 
            ok: false, 
            error: err instanceof Error ? err.message : String(err) 
        });
    }
}

async function _OPEN_IDB(): Promise<IDBDatabase> 
{
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('diagramDB', _SCHEMA.version);

        request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
            const target = e.target as IDBOpenDBRequest;
            const db: IDBDatabase = target.result;
            const tx = target.transaction as IDBTransaction;

            // 1. 객체 형태인 tables를 [이름, 설정] 배열로 변환해서 반복문 실행
            Object.entries(_SCHEMA.tables).forEach(([tableName, tableConfig]) => {
                let store: IDBObjectStore;

                // 2. 스토어 생성 또는 가져오기
                if (!db.objectStoreNames.contains(tableName)) {
                    store = db.createObjectStore(tableName, tableConfig.options);
                } else {
                    store = tx.objectStore(tableName);
                }

                // 3. 인덱스 생성 (tableConfig.index는 이제 배열임)
                tableConfig.index?.forEach(idx => {
                    if (!store.indexNames.contains(idx.key)) {
                        // idx.column도 타입 추론이 되므로 안전합니다.
                        store.createIndex(idx.key, idx.column as string, idx.options);
                    }
                });

                // 4. 버전 기록 (이름이 'version_history'인 경우)
                if (tableName === 'version_history') {
                    store.put({
                        version: e.newVersion,
                        versionPrev: e.oldVersion || null,
                        workDate: _SCHEMA.work_date,
                        timestamp: Date.now(),
                    });
                }
            });
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
