
export interface ObjectStore {
    name: string;
    keyPath: string;
    indexList?: Index[];
}
export interface Index {
    name: string;
    keyPath: string;
}