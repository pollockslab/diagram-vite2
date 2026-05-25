import { FileSystemIDB } from "./filesystem.idb";

export class FileSystem {
    idb = new FileSystemIDB();
    constructor() {

    }

    async Init() {
        await this.idb.OpenDB();
        
    }
}