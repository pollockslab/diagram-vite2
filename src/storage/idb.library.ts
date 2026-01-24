// 1. 반환 타입 명시: Get은 결과가 없을 수 있으므로 T | undefined
async function Get<T>(store: IDBObjectStore, key: IDBValidKey): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result as T);
        request.onerror = () => reject(request.error);
    });
}

// 2. GetByIndex는 getAll이므로 결과가 항상 배열(T[])입니다.
async function GetByIndex<T>(
    store: IDBObjectStore, 
    indexName: string, 
    key: IDBValidKey | null // key가 null일 수 있음을 명시
): Promise<T[]> {
    return new Promise((resolve, reject) => {
        // 1. key가 유효하지 않을 때의 처리 (IndexedDB는 null key 조회를 허용하지 않을 수 있음)
        if (key === null || key === undefined) {
            return resolve([]); // 빈 배열 반환으로 안전하게 처리
        }

        try {
            const index = store.index(indexName);
            const request = index.getAll(key);

            request.onsuccess = () => {
                // 2. 결과가 없으면 null이 아니라 빈 배열 []이 들어옵니다.
                resolve(request.result as T[]);
            };

            request.onerror = () => {
                console.error(`IndexedDB GetByIndex Error (${indexName}):`, request.error);
                reject(request.error);
            };
        } catch (err) {
            // 3. 존재하지 않는 indexName을 넣었을 때 등 런타임 에러 방지
            reject(err);
        }
    });
}

async function Put<T>(store: IDBObjectStore, value: T): Promise<IDBValidKey> {
    return new Promise((resolve, reject) => {
        const request = store.put(value);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// 3. PutAll의 반환 타입은 IDBValidKey의 배열입니다.
async function PutAll(store: IDBObjectStore, values: any[]): Promise<IDBValidKey[]> {
    const promises = values.map(value => Put(store, value));
    return Promise.all(promises);
}

async function Del(store: IDBObjectStore, key: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const request = store.delete(key);
        // delete의 result는 항상 undefined이므로 void 처리
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function DelAll(store: IDBObjectStore, keys: any[]): Promise<void[]> {
    const promises = keys.map(key => Del(store, key));
    return Promise.all(promises);
}

async function Clear(store: IDBObjectStore): Promise<void> {
    return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

function CreateUUID(): string {
    return crypto.randomUUID();
}

export const IDBLib = {
    Get, GetByIndex,
    Put, PutAll,
    Del, DelAll,
    Clear, CreateUUID,
};