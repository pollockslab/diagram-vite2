import { IndexedDB } from '@/engines/indexeddb/indexeddb';
import * as IndexeddbType from '@/engines/indexeddb/indexeddb.type'
import { objectStores } from './indexeddb.objectstores'

const _DB = new IndexedDB({
    name: 'wd-storage',
    version: 1,
    objectStores: objectStores,
});
_DB.OnVersionChange = () => {
    alert('새 IDB 버전이 있습니다. 페이지를 새로고침 해 주세요.');
}; 
_DB.OnBlocked = () => {
    alert('이전 탭에서 낮은 버전의 상태를 유지중입니다. 이전 탭을 닫아주세요.');
};

export class Storage {
    constructor() {}

    Transaction<T>(
        storeNames  : string[],
        txMode      : IDBTransactionMode,
        call        : IndexeddbType.TransactionCallback<T>,
    ): Promise<T> {
        return _DB.Transaction(storeNames, txMode, call);
    }
}