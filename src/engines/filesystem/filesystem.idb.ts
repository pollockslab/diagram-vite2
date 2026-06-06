
export class FileSystemIDB {
    idbName = 'wd-filesystem';
    storeName = 'handles';
    db: null | IDBDatabase = null;
    constructor() {}
    get isOpen() {
        return (this.db === null)? false:true;
    }
    async OpenDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(this.idbName, 1);
            req.onupgradeneeded = () => {
                req.result.createObjectStore(this.storeName);
            }
            req.onsuccess = () => {
                this.db = req.result;
                resolve(req.result);
            }
            req.onerror = () => {
                this.db = null;
                reject(req.error);
            } 
        });
    }

    async Get(key: string): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            if(this.db === null) {
                reject();
                return;
            }
            const tx = this.db.transaction(this.storeName, 'readonly');
            const store = tx.objectStore(this.storeName);
            const req = store.get(key);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async Put(key: string, value: unknown): Promise<void> {
        return new Promise((resolve, reject) => {
            if(this.db === null) {
                reject();
                return;
            }
            const tx = this.db.transaction(this.storeName, 'readwrite');
            const store = tx.objectStore(this.storeName);
            const req = store.put(value, key);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }
}