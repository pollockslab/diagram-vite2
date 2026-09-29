import * as IndexeddbType from './indexeddb.type'
import { IndexeddbCommand } from './indexeddb.command';

/**
 * [Class] IndexedDB
 * @description
 * 브라우저에서 제공하는 IndexedDB 를 사용하기 편하게 간소화한 클래스 입니다.  
 * ※ 데이터 저장소를 => 브라우저 FileSyetem API, 기타 DB서버 로 전환을 고려해,  
 *  IDB의 Store, Index 생성규칙을 최소화 했습니다. (name, keyPath 만 사용함.)
 * @example 
    const objectStores =  [
        {   // 첫번째 데이터   
            name: 'book',
            keyPath: 'bookID'
        },
        {   // 두번째 데이터
            name: 'student', 
            keyPath: 'studentID',
            indexList: [
                {   
                    name: 'idx_name',
                    keyPath: 'name',
                },
                {
                    name: 'idx_address',
                    keyPath: 'address'
                }
            ]
        },
    ];
    const idb = new Engines.IndexedDB({
        name: 'example1', 
        version: 1, 
        objectStores: objectStores
    });
    idb.OnVersionChange(() => {
        alert('새 버전이 있습니다. 페이지를 새로고침하세요.');
        location.reload();
    });
    
    // 예: 인덱스로 조회한 자식 다이어그램들을 전부 삭제 (조회 + 삭제를 한 트랜잭션에서 처리)
    await _STOR.Transaction(['diagram'], 'readwrite', async (cmd) => {
        const children = await cmd.GetAllByIndex('diagram', 'parentDiagramID', 'diagram-1');
        for (const child of children) {
            await cmd.Delete('diagram', child.axis.id);
        }
    });
 */
export class IndexedDB {
    name: string;
    version: number;
    objectStores: IndexeddbType.ObjectStore[];
    db: null | IDBDatabase = null;
    dbOpening: null | Promise<IDBDatabase> = null;

    constructor(args: {name: string, version: number, objectStores: IndexeddbType.ObjectStore[]}) {
        this.name = args.name;
        this.objectStores = args.objectStores;
        this.version = args.version;
        this.Open();
    }
    
    async Open(): Promise<IDBDatabase> {
        if(this.dbOpening) {return this.dbOpening;}

        this.dbOpening = new Promise((resolve, reject) => {
            const req = indexedDB.open(this.name, this.version);
            req.onupgradeneeded = (e) => {
                const db = req.result;
                const tx = (e.target as IDBOpenDBRequest).transaction!;

                for(const info of this.objectStores) {
                    let store: IDBObjectStore;

                    // [Create] ObjectStore
                    if(!req.result.objectStoreNames.contains(info.name)) {
                       store = db.createObjectStore(info.name, {keyPath: info.keyPath});    
                    }
                    else {
                        store = tx.objectStore(info.name);
                    }
                    
                    // [Create] Index
                    if(info.indexList) {
                        for(const index of info.indexList) {
                            if(!store.indexNames.contains(index.name)) {
                                store.createIndex(index.name, index.keyPath);
                            }
                        }
                    }
                }
            }
            req.onsuccess = () => {
                this.db = req.result;
                this.db.onversionchange = () => {
                    // [Check] 탭을 새로고침 하기 전까지 자유롭게 데이터를
                    //  저장할 수 있도록, this.Close() 를 호출하지 않는다.
                    this.OnVersionChange?.();
                };
                resolve(this.db);
            };
            req.onerror = () => {
                this.Close();
                reject(req.error);
            } 
            req.onblocked = () => {
                this.OnBlocked?.();
            }
        });
        return this.dbOpening;
    }
    
    /** 
     * [Event] OnVersionChange
     * @description
     * [onVersionChange 이벤트 호출되는 경우]
     * - 브라우저의 A탭(현재) 과 B탭 중, B탭에서 동일 서비스를 열었을 때,
     * - B탭에서 IDB 버전 증가가 있었다면, A탭(현재)에서 호출됨.
     * @example 
        const idb = new Engines.IndexedDB({
            name: 'example1', 
            version: 1, 
            objectStores: []
        });
        idb.OnVersionChange = () => {
            alert('새 버전이 있습니다. 페이지를 새로고침하세요.');
            location.reload();
        }; 
     */
    OnVersionChange?: () => void;

    /** 
     * [Event] OnBlocked
     * @description
     * [OnBlocked 이벤트가 호출되는 경우]
     * - A탭과 B탭(현재)에서 동일한 IDB를 열고 있는 상태에서,
     * - B탭(현재)이 더 높은 버전으로 Open()을 시도하면,
     * - A탭 쪽 db 객체에서는 OnVersionChange가 호출되고,
     * - B탭(현재) 쪽 open 요청은 OnBlocked 상태로 대기하게 됨.
     * - A탭이 db.close()를 호출하거나(OnVersionChange 핸들러 내) 탭 자체가 닫히면,
     *   B탭(현재)의 blocked 상태가 풀리고 OnUpgradeNeeded -> onsuccess 순으로 이어서 진행됨.
     * @example 
        const idb = new Engines.IndexedDB({
            name: 'example1', 
            version: 1, 
            objectStores: []
        });
        idb.OnBlocked = () => {
            alert('이전 탭에서 낮은 버전의 상태를 유지중입니다. 이전 탭을 닫아주세요.');
        }; 
    */
    OnBlocked?: () => void;

    /**
     * [Release] Close
     * @description IDB 연결을 종료합니다. 호출 즉시 접근이 차단되며,
     * 내부적으로 비동기 종료 작업이 진행됩니다.
     */
    Close() {
        this.db?.close();
        this.db = null;
        this.dbOpening = null;
    }

    /**
     * [Action] Transaction
     * @description
     * 하나의 트랜잭션 안에서 여러 스토어(objectStore)를 다루는 작업을 실행합니다.  
     * call 콜백에 전달되는 idbCommand로 Get/Put/Delete 등을 호출하면 되고,  
     * 콜백이 반환한 값이 트랜잭션 완료 시점에 그대로 반환됩니다.
     * @param storeNames 트랜잭션에서 사용할 objectStore 이름 목록
     * @param txMode 'readonly' | 'readwrite'
     * @param call idbCommand를 받아 실제 작업을 수행하는 콜백
     * @example 
        // 예: 인덱스로 조회한 자식 다이어그램들을 전부 삭제 (조회 + 삭제를 한 트랜잭션에서 처리)
        await idb.Transaction(['diagram'], 'readwrite', async (cmd) => {
            const children = await cmd.GetAllByIndex('diagram', 'parentDiagramID', 'diagram-1');
            for (const child of children) {
                await cmd.Delete('diagram', child.axis.id);
            }
        });
     */
    async Transaction<T>(
        storeNames: string[],
        txMode: IDBTransactionMode,
        call: IndexeddbType.TransactionCallback<T>,
    ): Promise<T> {
        const db = await this.Open();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeNames, txMode);
            let output: T;

            const idbCommand = new IndexeddbCommand(tx);

            tx.oncomplete = () => resolve(output);
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error ?? new Error('IDB Transaction Aborted'));

            call(idbCommand) 
            .then((result) => { output = result; })
            .catch(reject);
        });
    }
}