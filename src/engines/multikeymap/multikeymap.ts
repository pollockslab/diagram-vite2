import * as MultiKeyMapType from './multikeymap.type'


export class MultiKeyMap<V = any> {

    private store = new Map<string, V>();

    constructor() {}
    
    get keys(): MultiKeyMapType.Key[] {
        return [...this.store.keys()];
    }
    get values(): V[] {
        return [...this.store.values()];
    }
    get entries(): [MultiKeyMapType.Key[], V][] {
        return [...this.store.entries()].map(
            ([k, v]) => [this.DecodeKey(k), v] as [MultiKeyMapType.Key[], V]
        );
    }

    private EncodeKey(key: MultiKeyMapType.Key[]): string {
        return JSON.stringify(key);
    }
    private DecodeKey(key: string): MultiKeyMapType.Key[] {
        return JSON.parse(key);
    }

    Set(key: MultiKeyMapType.Key[], value: V) {
        this.store.set(this.EncodeKey(key), value);
    }

    Get(key: MultiKeyMapType.Key[]): V | undefined {
        return this.store.get(this.EncodeKey(key));
    }

    Has(key: MultiKeyMapType.Key[]): boolean {
        return this.store.has(this.EncodeKey(key));
    }

    Delete(key: MultiKeyMapType.Key[]): boolean {
        return this.store.delete(this.EncodeKey(key));
    }

    DeleteAll() {
        this.store.clear();
    }
}