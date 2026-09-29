import * as IndexeddbType from './indexeddb.type'

export class IndexeddbCommand implements IndexeddbType.StoreCommand {
    constructor(private tx: IDBTransaction) {}

    private ToPromise<T>(req: IDBRequest<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    /**
     * [Find] Get
     * @description 키로 단일 레코드를 조회합니다.
     * @example cmd.Get('settings', '1')
     */
    Get<T = any>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
        return this.ToPromise(this.tx.objectStore(storeName).get(key));
    }

    /**
     * [Find] GetAll
     * @description 스토어의 모든 레코드를 조회합니다.
     * @example cmd.GetAll('tab')
     */
    GetAll<T = any>(storeName: string): Promise<T[]> {
        return this.ToPromise(this.tx.objectStore(storeName).getAll());
    }

    /**
     * [Update] Put
     * @description 기존 레코드를 수정합니다. 동일 키가 존재하지 않으면 에러를 던집니다 (신규 생성 방지).
     * 새로 생성하고 싶다면 Add를 사용하세요.
     * @example cmd.Put('settings', { settings: { id: '1', theme: 'dark' } })
     */
    async Put<T = any>(storeName: string, value: T): Promise<IDBValidKey> {
        const store = this.tx.objectStore(storeName);
        const key = (value as any)[store.keyPath as string];
        // keyPath가 중첩 경로('settings.id')인 경우도 처리
        const resolvedKey = 
            ( typeof store.keyPath === 'string' && store.keyPath.includes('.') )? 
            store.keyPath.split('.').reduce((obj, k) => obj?.[k], value as any) 
            : key;
            
        const exists = await this.ToPromise(store.get(resolvedKey));
        if (exists === undefined) {
            throw new Error(`[Put] '${storeName}' 스토어에 키 '${resolvedKey}'가 존재하지 않습니다. 새로 생성하려면 Add를 사용하세요.`);
        }
        return this.ToPromise(store.put(value));
    }

    /**
     * [Create] Add
     * @description 새 레코드를 추가합니다. 동일 키가 이미 존재하면 에러가 발생합니다 (Put과의 차이).
     * @example cmd.Add('diagram', { axis: { id: 'diagram-1', type: 'rect' } })
     */
    Add<T = any>(storeName: string, value: T): Promise<IDBValidKey> {
        return this.ToPromise(this.tx.objectStore(storeName).add(value));
    }

    /**
     * [Delete] Delete
     * @description 키로 단일 레코드를 삭제합니다.
     * @example cmd.Delete('diagram', 'diagram-1')
     */
    Delete(storeName: string, key: IDBValidKey): Promise<void> {
        return this.ToPromise(this.tx.objectStore(storeName).delete(key));
    }

    /**
     * [Delete] Clear
     * @description 스토어의 모든 레코드를 삭제합니다.
     * @example cmd.Clear('log')
     */
    Clear(storeName: string): Promise<void> {
        return this.ToPromise(this.tx.objectStore(storeName).clear());
    }

    /**
     * [Find] Count
     * @description 스토어의 전체 레코드 개수를 셉니다.
     * @example cmd.Count('diagram')
     */
    Count(storeName: string): Promise<number> {
        return this.ToPromise(this.tx.objectStore(storeName).count());
    }

    /**
     * [Find] GetByIndex
     * @description 인덱스로 단일 레코드를 조회합니다 (일치하는 첫 번째 값).
     * @example cmd.GetByIndex('diagram', 'type', 'rect')
     */
    GetByIndex<T = any>(storeName: string, indexName: string, key: IDBValidKey): Promise<T | undefined> {
        const index = this.tx.objectStore(storeName).index(indexName);
        return this.ToPromise(index.get(key));
    }

    /**
     * [Find] GetAllByIndex
     * @description 인덱스로 여러 레코드를 조회합니다. key를 생략하면 해당 인덱스의 전체 값을 반환합니다.
     * @example cmd.GetAllByIndex('diagram', 'parentDiagramID', 'diagram-1')
     * @example cmd.GetAllByIndex('diagram', 'zIndex', IDBKeyRange.bound(1, 10))
     */
    GetAllByIndex<T = any>(storeName: string, indexName: string, key?: IDBValidKey | IDBKeyRange): Promise<T[]> {
        const index = this.tx.objectStore(storeName).index(indexName);
        return this.ToPromise(index.getAll(key));
    }

    /**
     * [Find] CountByIndex
     * @description 인덱스 조건에 맞는 레코드 개수를 셉니다.
     * @example cmd.CountByIndex('diagram', 'zIndex', IDBKeyRange.bound(1, 10))
     */
    CountByIndex(storeName: string, indexName: string, key?: IDBValidKey | IDBKeyRange): Promise<number> {
        const index = this.tx.objectStore(storeName).index(indexName);
        return this.ToPromise(index.count(key));
    }
}