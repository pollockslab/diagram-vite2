import * as IndexeddbType from './indexeddb.type'

/**
 * [Class] IndexedDB
 * @description
 * 브라우저에서 제공하는 IndexedDB 를 사용하기 편하게 간소화한 클래스 입니다.  
 * ※ 데이터 저장소를 => 브라우저 FileSyetem API, 기타 DB서버 로 전환을 고려해,  
 *  IDB의 Store, Index 생성규칙을 최소화 했습니다. (name, keyPath 만 사용함.)
 * @example 
    const storeList =  [
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
        storeList: storeList
    });
    idb.OnVersionChange(() => {
        idb?.close();
        alert('새 버전이 있습니다. 페이지를 새로고침하세요.');
        location.reload();
    });
    await idb.Open();
 */
export class IndexedDB {
    name: string;
    version: number;
    storeList: IndexeddbType.ObjectStore[];
    db: null | IDBDatabase = null;

    constructor(args: {name: string, version: number, storeList: IndexeddbType.ObjectStore[]}) {
        this.name = args.name;
        this.storeList = args.storeList;
        this.version = args.version;
    }

    get isOpen() {
        return (this.db === null)? false:true;
    }
    
    async Open(): Promise<void> {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(this.name, this.version);
            req.onupgradeneeded = (e) => {
                const db = req.result;
                const tx = (e.target as IDBOpenDBRequest).transaction!;

                for(const info of this.storeList) {
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
                    this.OnVersionChange?.();
                };
                resolve();
            };
            req.onerror = () => {
                this.db = null;
                reject(req.error);
            } 
            req.onblocked = () => {
                reject(new DOMException('IDB open blocked by another tab', 'BlockedError'));
            }
        });
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
            storeList: []
        });
        idb.OnVersionChange = () => {
            idb?.close();
            alert('새 버전이 있습니다. 페이지를 새로고침하세요.');
            location.reload();
        }; 
        idb.Open();
     */
    OnVersionChange?: () => void;

    /**
     * [Release] Close
     * @description IDB 연결을 종료합니다. 호출 즉시 접근이 차단되며,
     * 내부적으로 비동기 종료 작업이 진행됩니다.
     */
    Close() {
        this.db?.close();
        this.db = null;
    }

    /**
     * [Find] Get 
     * @param storeName 오브젝트스토어 이름
     * @param primaryKey 고유 키
     * @returns 찾은 데이터 | undefined
     * @example
        export interface Book {
            bookID: string;
            title: string;
            author: string;
        }
        const book = await idb.Get<Book>('book', 'b123');
        if (book) {
            console.log(book.title); 
        }
     */
    async Get<T>(storeName: string, primaryKey: string): Promise<T | undefined> {
        return new Promise((resolve, reject) => {
            if(this.db === null) {
                reject(new DOMException('IDB not opened', 'InvalidStateError'));
                return;
            }

            if(!this.db.objectStoreNames.contains(storeName)) {
                reject(new DOMException(`IDB Store name '${storeName}' not found`, 'NotFoundError'));
                return;
            }

            const tx = this.db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const req = store.get(primaryKey);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
            tx.onerror = () => reject(req.error);
            tx.onabort = () => reject('IDB Transaction aborted');
        });
    }
    /**
     * [Find] GetAll
     * @param storeName 오브젝트스토어 이름
     * @returns 모든 데이터의 배열 | undefined
     * @example
     * const allBooks = await idb.GetAll<Book>('book');
     * if (allBooks) {
     * allBooks.forEach(book => console.log(book.title));
     * }
     */
    async GetAll<T>(storeName: string): Promise<T[] | undefined> {
        return new Promise((resolve, reject) => {
            if(this.db === null) {
                reject(new DOMException('IDB not opened', 'InvalidStateError'));
                return;
            }

            if(!this.db.objectStoreNames.contains(storeName)) {
                reject(new DOMException(`IDB Store name '${storeName}' not found`, 'NotFoundError'));
                return;
            }

            const tx = this.db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const req = store.getAll();

            req.onsuccess = () => resolve(req.result as T[]);
            req.onerror = () => reject(req.error);
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject('IDB Transaction aborted');
        });
    }

    /**
     * [Find] GetByIndex
     * @param storeName 오브젝트스토어 이름
     * @param indexName 인덱스 이름 (설정된 인덱스여야 함)
     * @param findKey 검색할 값
     * @returns 찾은 데이터 배열 | undefined
     * @example
     * // 'idx_group' 인덱스로 다이어그램들을 조회
     * const groupItems = await idb.GetByIndex<Diagram>('diagrams', 'idx_group', '사각형');
     */
    async GetByIndex<T>(storeName: string, indexName: string, findKey: any): Promise<T[] | undefined> {
        return new Promise((resolve, reject) => {
            if(this.db === null) {
                reject(new DOMException('IDB not opened', 'InvalidStateError'));
                return;
            }

            if(!this.db.objectStoreNames.contains(storeName)) {
                reject(new DOMException(`IDB Store name '${storeName}' not found`, 'NotFoundError'));
                return;
            }

            const tx = this.db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);

            if(!store.indexNames.contains(indexName)) {
                reject(new DOMException(`IDB Index name '${indexName}' not found`, 'NotFoundError'));
                return;
            }

            const index = store.index(indexName);
            const req = index.getAll(findKey);

            req.onsuccess = () => resolve(req.result as T[]);
            req.onerror = () => reject(req.error);
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject('IDB Transaction aborted');
        });
    }

    /**
     * [Find] GetAllByIndex
     * @param storeName 오브젝트스토어 이름
     * @param indexName 인덱스 이름 (설정된 인덱스여야 함)
     * @returns 모든 데이터 배열 | undefined
     * @example
     * // 'idx_group' 인덱스로 다이어그램들을 전체조회
     * const groupItems = await idb.GetByIndex<Diagram>('diagrams', 'idx_group');
     */
    async GetAllByIndex<T>(storeName: string, indexName: string, ): Promise<T[] | undefined> {
          return new Promise((resolve, reject) => {
            if(this.db === null) {
                reject(new DOMException('IDB not opened', 'InvalidStateError'));
                return;
            }

            if(!this.db.objectStoreNames.contains(storeName)) {
                reject(new DOMException(`IDB Store name '${storeName}' not found`, 'NotFoundError'));
                return;
            }

            const tx = this.db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);

            if(!store.indexNames.contains(indexName)) {
                reject(new DOMException(`IDB Index name '${indexName}' not found`, 'NotFoundError'));
                return;
            }

            const index = store.index(indexName);
            const req = index.getAll();

            req.onsuccess = () => resolve(req.result as T[]);
            req.onerror = () => reject(req.error);
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject('IDB Transaction aborted');
        });
    }

    /**
     * [Insert] Add
     * @param storeName 오브젝트스토어 이름
     * @param value 저장할 데이터 객체 (primaryKey 포함)
     * - IDB를 간소화 하기 위하여, ObjectStore 생성시 keyPath를 강제 설정하게 되어 있으므로,
     * - value안에 primaryKey 를 포함하고 있어야 합니다.
     * @example
     * // 새로운 학생정보 생성 (이미 존재하면 에러)
     * await idb.Add('student', {id: 'student0001', name: '철수'});
     */
    async Add<T>(storeName: string, value: T): Promise<void> {
        return new Promise((resolve, reject) => {
            if(this.db === null) {
                reject(new DOMException('IDB not opened', 'InvalidStateError'));
                return;
            }

            if(!this.db.objectStoreNames.contains(storeName)) {
                reject(new DOMException(`IDB Store name '${storeName}' not found`, 'NotFoundError'));
                return;
            }

            const tx = this.db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const keyPath = store.keyPath as string;
            // [Find] keyPath로 ID값 찾기 (예: 오브젝트.오브젝트...아이디 필드)
            const keyValue = keyPath.split('.').reduce((obj, key) => obj?.[key], value as Record<string, any>) as IDBValidKey;

            const reqGET = store.get(keyValue);
            reqGET.onsuccess = () => {
                if(reqGET.result) {
                    reject(new DOMException('IDB Record already exists', 'ConstraintError'));
                    return;
                }
                const reqADD = store.add(value);
                reqADD.onsuccess = () => resolve();
                reqADD.onerror = () => reject(reqADD.error);
            };
            reqGET.onerror = () => reject(reqGET.error);
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(new Error('IDB Transaction aborted'));
        }); 
    }

    /**
     * [Insert] AddAll
     * @description 파라미터로 전달된 목록을 한번에 Insert 합니다.
     * - [Optimize] 전달된 모든 데이터를 하나의 트랜잭션으로 처리합니다.
     * - [Atomic] 하나라도 실패하면 전체 작업이 자동으로 롤백됩니다.
     * @param storeName 오브젝트스토어 이름
     * @param values 저장할 데이터 객체배열 (primaryKey 포함)
     * @example 
        // 'id' 가 primaryKey 인 학생정보 리스트 추가.
        idb.AddAll('student', [
            {id: 'student0001', name: '철수'},
            {id: 'student0002', name: '영희'},
            {id: 'student0003', name: '민호'},
            ...
        ]);
     */
    async AddAll<T>(storeName: string, values: T[]): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.db === null) {
                reject(new DOMException('IDB not opened', 'InvalidStateError'));
                return;
            }
            if (!this.db.objectStoreNames.contains(storeName)) {
                reject(new DOMException(`IDB Store name '${storeName}' not found`, 'NotFoundError'));
                return;
            }
            if (values.length === 0) {
                resolve();
                return;
            }

            const tx = this.db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const keyPath = store.keyPath as string;
            let isAborted = false;
            let abortMessage = 'IDB Transaction aborted';

            values.forEach(value => {
                // [Find] keyPath로 ID값 찾기 (예: 오브젝트.오브젝트...아이디 필드)
                const keyValue = keyPath.split('.').reduce((obj, key) => obj?.[key], value as Record<string, any>) as IDBValidKey;
                const reqGET = store.get(keyValue);
                reqGET.onsuccess = () => {
                    if(isAborted) {return;}
                    // [Validation] Insert할 데이터가 이미 존재하면 전체 롤백
                    if (reqGET.result) {
                        isAborted = true;
                        abortMessage = `IDB AddAll Failed Key: '${keyValue}' already exists.`;
                        tx.abort(); 
                        return;
                    }
                    store.add(value);
                };
                reqGET.onerror = () => {
                    if(isAborted) {return;}
                    isAborted = true;
                    abortMessage = `IDB AddAll Failed: Read operation failed for key '${keyValue}'. Original Error: ${reqGET.error?.message}`;
                    tx.abort();
                }
            });

            tx.oncomplete = () => resolve();
            tx.onerror   = () => reject(tx.error);
            tx.onabort   = () => reject(new Error(abortMessage));
        });
    }

    /**
     * [Update] Put
     * @param storeName 오브젝트스토어 이름
     * @param value 저장할 데이터 객체 (primaryKey 포함)
     * - IDB를 간소화 하기 위하여, ObjectStore 생성시 keyPath를 강제 설정하게 되어 있으므로,
     * - value안에 primaryKey 를 포함하고 있어야 합니다.
     * @example 
        // 'id' 가 primaryKey 인 학생정보 업데이트.
        idb.put('student', {id: 'student0001', name: '철수'});
     */
    async Put<T>(storeName: string, value: T): Promise<void> {
        return new Promise((resolve, reject) => {
            if(this.db === null) {
                reject(new DOMException('IDB not opened', 'InvalidStateError'));
                return;
            }

            if(!this.db.objectStoreNames.contains(storeName)) {
                reject(new DOMException(`IDB Store name '${storeName}' not found`, 'NotFoundError'));
                return;
            }

            const tx = this.db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);

            const keyPath = store.keyPath as string;
            // [Find] keyPath로 ID값 찾기 (예: 오브젝트.오브젝트...아이디 필드)
            const keyValue = keyPath.split('.').reduce((obj, key) => obj?.[key], value as Record<string, any>) as IDBValidKey;
            const reqGET = store.get(keyValue);
            reqGET.onsuccess = () => {
                if(!reqGET.result) {
                    reject(new DOMException('IDB Target record not found for update', 'NotFoundError'));
                    return;
                }
                const reqPUT = store.put(value);
                reqPUT.onsuccess = () => resolve();
                reqPUT.onerror = () => reject(reqPUT.error);
            };
            reqGET.onerror = () => reject(reqGET.error);
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject('IDB Transaction aborted');
        });
    }

    /**
     * [Update] PutAll
     * @description 파라미터로 전달된 목록을 한번에 Update 합니다.
     * - [Optimize] 전달된 모든 데이터를 하나의 트랜잭션으로 처리합니다.
     * - [Atomic] 하나라도 실패하면 전체 작업이 자동으로 롤백됩니다.
     * @param storeName 오브젝트스토어 이름
     * @param values 저장할 데이터 객체배열 (primaryKey 포함)
     * @example 
        // 'id' 가 primaryKey 인 학생정보 리스트 업데이트.
        idb.putAll('student', [
            {id: 'student0001', name: '철수'},
            {id: 'student0002', name: '영희'},
            {id: 'student0003', name: '민호'},
            ...
        ]);
     */
    async PutAll<T>(storeName: string, values: T[]): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.db === null) {
                reject(new DOMException('IDB not opened', 'InvalidStateError'));
                return;
            }
            if (!this.db.objectStoreNames.contains(storeName)) {
                reject(new DOMException(`IDB Store name '${storeName}' not found`, 'NotFoundError'));
                return;
            }
            if (values.length === 0) {
                resolve();
                return;
            }

            const tx = this.db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const keyPath = store.keyPath as string;
            let isAborted = false;
            let abortMessage = 'IDB Transaction aborted';

            values.forEach(value => {
                // [Find] keyPath로 ID값 찾기 (예: 오브젝트.오브젝트...아이디 필드)
                const keyValue = keyPath.split('.').reduce((obj, key) => obj?.[key], value as Record<string, any>) as IDBValidKey;
                const reqGET = store.get(keyValue);
                reqGET.onsuccess = () => {
                    if(isAborted) {return;}
                    // [Validation] Update할 데이터가 존재하지 않으면 전체 롤백
                    if (!reqGET.result) {
                        isAborted = true;
                        abortMessage = `IDB PutAll Failed Key: '${keyValue}' not exists.`;
                        tx.abort(); 
                        return;
                    }
                    store.put(value);
                };
                reqGET.onerror = () => {
                    if(isAborted) {return;}
                    isAborted = true;
                    abortMessage = `IDB PutAll Failed: Read operation failed for key '${keyValue}'. Original Error: ${reqGET.error?.message}`;
                    tx.abort();
                }
            });

            tx.oncomplete = () => resolve();
            tx.onerror   = () => reject(tx.error);
            tx.onabort   = () => reject(new Error(abortMessage));
        });
    }

    /**
     * [Delete] Delete
     * @description 오브젝트스토어 내 일치하는 key를 가지고 있는 데이터 삭제 
     * @param storeName 오브젝트스토어 이름
     * @param primaryKey 삭제할 데이터의 primaryKey
     * @example
     * // 'sq1' 아이디를 가진 도형 삭제
     * await idb.Delete('diagrams', 'sq1');
     */
    async Delete(storeName: string, primaryKey: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if(this.db === null) {
                reject(new DOMException('IDB not opened', 'InvalidStateError'));
                return;
            }

            if(!this.db.objectStoreNames.contains(storeName)) {
                reject(new DOMException(`IDB Store name '${storeName}' not found`, 'NotFoundError'));
                return;
            }

            const tx = this.db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const reqGET = store.get(primaryKey);
            reqGET.onsuccess = () => {
                if(!reqGET.result) {
                    // reject(new DOMException('IDB Target record not found for delete', 'NotFoundError'));
                    // [Validation] 삭제대상이 없는건 오류가 아니라고 판단하여, 정상종료 처리.
                    resolve();
                    return;
                }
                const reqDEL = store.delete(primaryKey);
                reqDEL.onsuccess = () => resolve();
                reqDEL.onerror = () => reject(reqDEL.error);
            };
            reqGET.onerror = () => reject(reqGET.error);
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject('IDB Transaction aborted');
        });
    }

    /**
     * [Delete] DeleteAll
     * @description 오브젝트스토어 내 데이터 일괄삭제 (※주의: 삭제 후 되돌릴 수 없습니다.)
     * @param storeName 오브젝트스토어 이름
     * @example
     * // 'diagrams' 오브젝트스토어의 데이터 일괄삭제
     * await idb.DeleteAll('diagrams');
     */
    async DeleteAll(storeName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if(this.db === null) {
                reject(new DOMException('IDB not opened', 'InvalidStateError'));
                return;
            }

            if(!this.db.objectStoreNames.contains(storeName)) {
                reject(new DOMException(`IDB Store name '${storeName}' not found`, 'NotFoundError'));
                return;
            }
            const tx = this.db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const req = store.clear();

            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(new Error('IDB Transaction aborted'));
        });
    }
}