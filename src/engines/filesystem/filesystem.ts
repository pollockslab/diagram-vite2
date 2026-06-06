import { FileSystemIDB } from "./filesystem.idb";

export class FileSystem {
    idb = new FileSystemIDB();
    constructor() {

    }

    async Init() {
        await this.idb.OpenDB();
        await this.idb.Put('a1', {a:1,b:2,c:3});
        // console.log(await this.idb.Get('a1'));

        // 경로 idb에서 확인해서 권한을 띄우던 일단 
        // 파일시스템 갖고와야됨.
        // 아닐경우 어쩌냐.

        // [방법1] 매번 하나의 경로만 잡으면 찾기가 귀찮을것도 같고
        // 연결되었던 주소를 가지고 있으면 토큰
    }
}