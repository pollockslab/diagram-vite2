// [Diagram] 다이어그램 거래 모음
import { _VIEW, _REMO, _LOOP, _SPCE, _STOR, _MNGR } from '../main';
import * as Diagrams from '@/diagrams/diagrams'
import * as DiagramsType from '@/diagrams/diagrams.type'


/**
 * [Action] SelectDiagram
 * @description 다이어그램을 선택, 앞으로 오게 저장합니다.
 * ※ 단순 z-index 만 Storage 에 저장하기 때문에, 트랜잭션 불필요 하다고 판단함.
 *  (메멘토 redo, undo 목록에서 제외함.)
 */
export function Select(id: string) {
    // 1. 위치에 다이어그램이 있는지 체크
    // 2. 있으면 제일 앞에 있는걸 선택
    // 2-1. zIndex 업데이트 (zindex 변경인데 메멘토가 필요할까?)
    // (여튼 새로고침 했을떄 변경된 zindex 대로 들어오긴 하는데.)
    // (이 함수는 메멘토 불필요)

    // 3. 없으면 종료
    
    //////////////
    // 이걸 어디에서 호출할까?
    // 1. 탭키로 자식다이어그램 전부 조회해서 스페이스에 저장 시킬때
    // 2. 그럼 컨트롤러 클릭시 콜리전체크는? 바로 스페이스에서 하지
    // 3. 콜리전 체크는 전부 스페이스에서 한다 -> select 호출은 로드할 때 뿐인데.

    // 그럼, 인서트는? 리모콘 사각형 누르고 배경 선택하면 인서트상황이라 판단함?
    // 이건 이미 매니저.컨트롤러 클릭에서 다 하는중인데. 

    // 업데이트는? 사각형 드래그로 끌었을때

    // 그럼 이 함수는 진짜 다이어그램이 선택되는걸 해야될지.
}

/**
 * (Ctrl + C) -> (Ctrl + V) 복사+붙여넣기때도 활용하기 위해 파라미터로 serialize 받아서 적용.
 * @param serialize 
 */
export async function Insert(serialize: any) {
    console.log('실행')
    // [New] 다이어그램 생성
    serialize.axis.parentId = _SPCE.id;
    serialize.axis.tabId = _SPCE.tabId;
    const diagram = Cover(serialize);
    if(!diagram) {return;}
    _SPCE.Insert(diagram);

    try {
        // [DB] 스토리지 저장.
        await _STOR.Post('diagram-insert', diagram.serialize);
    }
    catch(error) {
        console.error('[ERROR]: ', error);
        // [Space] 다이어그램 삭제.
        _SPCE.Delete(diagram.serialize);
    }
}

export function Update() {

}

export function Delete(serialize: DiagramsType.serialize.Union) {
    // try {
    //     // [DB] 스토리지 저장.
    //     await _STOR.Post('diagram-delete', serializeSpace);

    // }
    // catch(error) {
    //     console.error('[ERROR]: ', error);
    //     // [Space] 다이어그램 삭제.
    //     _SPCE.Delete(serializeSpace);
    // }
}

/**
 * [Function] Cover
 * @description 다이어그램 데이터를 인스턴스로 변환(생성)합니다.
 * @param serialize { axis: { type?: 'axis' | 'square' | 'point', ... } }
 * @returns 생성된 다이어그램 인스턴스 또는 실패 시 undefined
 */
export function Cover(serialize: any): undefined | DiagramsType.Instance {
    
    // [New] 새 정보 생성. 
    serialize.axis.id = crypto.randomUUID(); // [UUID] 새 아이디 생성.
    serialize.axis.zIndex = Date.now();
    serialize.axis.type = serialize.axis.type ?? 'axis';

    try {
        // [Instance] 다이어그램 생성
        const typeClass = (Diagrams.Class as any)[serialize.axis.type];
        const instance = new typeClass(serialize);

        return instance;
    }
    catch(error) {
        console.error(`[Cover ERROR] 인스턴스 생성 실패: ${serialize.axis.type}`, error);
        return undefined;
    }
    
}
