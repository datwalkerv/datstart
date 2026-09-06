/** Minimal IndexedDB key/value store for background image blobs. */
const DB_NAME = "datstart";
const DB_VERSION = 1;
const STORE = "assets";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) {
        request.result.createObjectStore(STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function tx<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const request = run(db.transaction(STORE, mode).objectStore(STORE));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }),
  );
}

export function putAsset(key: string, blob: Blob): Promise<unknown> {
  return tx("readwrite", (store) => store.put(blob, key));
}

export function getAsset(key: string): Promise<Blob | undefined> {
  return tx<Blob | undefined>("readonly", (store) => store.get(key));
}

export function deleteAsset(key: string): Promise<unknown> {
  return tx("readwrite", (store) => store.delete(key));
}
