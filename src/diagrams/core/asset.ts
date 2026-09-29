

export class Asset {

    id: String|null = null; 

    asset = {
        
    };
    file = {
        title: 0,
        size: 0,
        lastdate: 0,
        extension: 'txt' as string
    }
    constructor() {}

    get serialize() {
        return null;
    }

    // 파일 특정부분을 추출해서 id를 만드는 방식
    // 제목, 최종 수정일만 다른경우엔 동일파일로 보고
    // idb.asset 에 저장하고, 참조하는 다이어그램에서 title도 가지고 있는다?
    // [asset_blob] [asset_meta] 로 나누고
    // FK 로 서로 연결시키고, asset_meta 는 UUID 로 만들어서
    // diagram 에 참조시키면 될듯
}