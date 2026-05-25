

export async function SelectDirectory() {
  try {
    // 1. 디렉토리 선택 창 띄우기
    const handle = await window.showDirectoryPicker({
      mode: 'readwrite', // 'read' 또는 'readwrite'
    });

    // 2. 폴더 내 파일/폴더 순회
    for await (const entry of handle.values()) {
      if (entry.kind === 'file') {
        const file = await entry.getFile();
        console.log('파일 발견:', file.name);
      } else if (entry.kind === 'directory') {
        console.log('폴더 발견:', entry.name);
      }
    }
  } catch (err) {
    console.error('사용자가 취소했거나 권한이 없습니다.', err);
  }
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('myDB', 1);
    
    req.onupgradeneeded = () => {
      req.result.createObjectStore('handles');
    };
    
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function dbPut(db: IDBDatabase, storeName: string, value: unknown, key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put(value, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function dbGet<T>(db: IDBDatabase, storeName: string, key: string): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
  });
}

// 1. 최초 실행 - 폴더 선택 및 저장
export async function openDirectory() {
  const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
  
  const db = await openDB();
  await dbPut(db, 'handles', handle, 'dirHandle');
  
  return handle;
}

// 2. 새로고침 후 - 저장된 핸들로 권한 재요청
export async function restoreDirectory() {
  const db = await openDB();
  const handle = await dbGet<FileSystemDirectoryHandle>(db, 'handles', 'dirHandle');
  
  if (!handle) {
    return await openDirectory();
  }

  const permission = await handle.queryPermission({ mode: 'readwrite' });
  
  if (permission === 'granted') {
    return handle;
  }

  const result = await handle.requestPermission({ mode: 'readwrite' });
  
  if (result === 'granted') {
    return handle;
  }
  
  throw new Error('권한 거부됨');
}
