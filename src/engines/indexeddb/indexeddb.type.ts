
export interface ObjectStore {
    name: string;
    keyPath: string;
    indexList?: Index[];
}
export interface Index {
    name: string;
    keyPath: string;
}

export type StoreCommand = {
    // [IDB.ObjectStore]
    Get: <T = any>(storeName: string, key: IDBValidKey) => Promise<T | undefined>;
    GetAll: <T = any>(storeName: string) => Promise<T[]>;
    Put: <T = any>(storeName: string, value: T) => Promise<IDBValidKey>;
    Add: <T = any>(storeName: string, value: T) => Promise<IDBValidKey>;
    Delete: (storeName: string, key: IDBValidKey) => Promise<void>;
    Clear: (storeName: string) => Promise<void>;
    Count: (storeName: string) => Promise<number>;

    // [IDB.Index]
    GetByIndex: <T = any>(storeName: string, indexName: string, key: IDBValidKey) => Promise<T | undefined>;
    GetAllByIndex: <T = any>(storeName: string, indexName: string, key?: IDBValidKey | IDBKeyRange) => Promise<T[]>;
    CountByIndex: (storeName: string, indexName: string, key?: IDBValidKey | IDBKeyRange) => Promise<number>;
};
export type TransactionCallback<T> = (command: StoreCommand) => Promise<T>;