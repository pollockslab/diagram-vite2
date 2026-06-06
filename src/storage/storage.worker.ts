import { IndexedDB } from "@/engines/indexeddb/indexeddb";
import { Schema } from './SCHEMA'


const _DB = new IndexedDB({
    name: 'wd-storage',
    version: 1,
    storeList: Schema
});
_DB.OnVersionChange = () => {
    alert('새 IDB 버전이 있습니다. 페이지를 새로고침 해 주세요.');
}; 

self.onmessage = async (e: MessageEvent) => {
    const { id, command, data } = e.data;
    const split = command.split('-');
    
    try {
        let result: any;
        if(split[0] === 'open') {
            await _DB.Open();
        }
        else {
            const storeName = split[0];
            const action = split[1];

            switch(split[1]) {
                case 'select':
                    result = await _DB.Get(storeName, data);
                    break;
                case 'index':
                    result = await _DB.GetByIndex(storeName, data.indexName, data.findKey);
                    break;    
                case 'insert':
                    await _DB.Add(storeName, data);
                    break;
                case 'update':
                    await _DB.Put(storeName, data);
                    break;
                case 'delete':
                    await _DB.Delete(storeName, data);
                    break;
                default:
                    throw new Error(`지원하지 않는 명령입니다: ${action}`);
            }
        }
        self.postMessage({ id, isCompleted: true, result});
    }
    catch(error) {
        self.postMessage({ 
            id, 
            isCompleted: false, 
            error: error instanceof Error ? error.message : String(error) 
        });
    }
}   

self.onerror = (message, source, lineno, colno, error) => {
    console.error('Worker error: ', {message, source, lineno, colno, error});
    alert('데이터 동기화 오류가 발생했습니다. 페이지를 새로고침 해 주세요.');
};

