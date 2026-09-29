// [Diagram] 다이어그램 거래 모음
import { _VIEW, _REMO, _LOOP, _SPCE, _STOR, _MNGR } from '@/main';
import * as Diagrams from '@/diagrams/diagrams'
import * as DiagramsType from '@/diagrams/diagrams.type'
import * as IndexeddbType from '@/engines/indexeddb/indexeddb.type'
import * as Common from '@/engines/common'


/**
 * [Function] Cover
 * @description 다이어그램 데이터를 인스턴스로 변환(생성)합니다.
 * @param serialize { axis: { type?: 'axis' | 'square' | 'point', ... } }
 * @returns 생성된 다이어그램 인스턴스 또는 실패 시 undefined
 */
export function Cover(serialize: any): undefined | DiagramsType.Instance {
    
    // [New] 새 정보 생성. 
    serialize.axis.id = serialize.axis.id ?? crypto.randomUUID(); // [UUID] 새 아이디 생성.
    serialize.type = serialize.axis.type ?? 'Axis';

    try {
        // [Instance] 다이어그램 생성
        const typeClass = (Diagrams.Class as any)[serialize.axis.type];
        const instance = typeClass.create(serialize);
        return instance;
    }
    catch(error) {
        console.error(`[Cover ERROR] 인스턴스 생성 실패: ${serialize.axis.type}`, error);
        return undefined;
    }
}

/**
 * (Ctrl + C) -> (Ctrl + V) 복사+붙여넣기때도 활용하기 위해 파라미터로 serialize 받아서 적용.
 * @param serialize 
 * @param options {
        isMementoPush?: boolean 메멘토 히스토리 입력유무(Redo, Undo 에 포함유무)
   }
 */
export async function Insert(
    serialize: any,
    options: { isMementoPush?: boolean } = {}
) {     
    // [New] 다이어그램 생성
    serialize.axis.id.space = _SPCE.spaceID;
    serialize.axis.id.tab = _SPCE.tabID;
    serialize.axis.zIndex = Date.now();
    const diagram = Cover(serialize);
    if(!diagram) {return;}
    _SPCE.Insert(diagram);
    console.log(diagram.serialize)
    try {
        // [DB] 스토리지 저장.
        await _STOR.Post('diagram-insert', diagram.serialize);

        // 여기에 Space 추가

        // 그 외 테이블. 더 추가
        
    }
    catch(error) {
        console.error('[INSERT ERROR]: ', error);
        // [Space] 다이어그램 삭제.
        _SPCE.Delete(diagram);
        return;
    }

    // [Memento] 추가
    const isMementoPush = options.isMementoPush ?? true;
    if(isMementoPush) {
        const work = {
            before: null,
            after: diagram.serialize,
        };
        await _MNGR.memento.Exec('diagram', [work]);
    }
}

export async function InsertTX(
    cmd: IndexeddbType.StoreCommand, 
    data: {type: DiagramsType.ClassName; [key: string]: unknown},
): Promise<DiagramsType.Instance> {
    const typeClass = Diagrams.Class[data.type];
    if(!typeClass) {throw new Error(`Diagram type not found: '${data.type}'`);}
    const diagram = new typeClass();

    // [Patch] Origin(다이어그램 초기값) 규격에, 데이터 덮어쓰기.
    const serialize = Common.PatchObjectDeep(typeClass.origin, data);

    // [Sync] 다이어그램에 값 반영.
    diagram.serialize = serialize;

    // [New] 아이디 없다면 생성. 
    if(!diagram.id) {
        diagram.id = crypto.randomUUID();
    }
    // [Upgrade] 저장할 때마다 버전 증가. (변경 추적용. Update 시 버전이 튀면 오류로 판단)
    diagram.version++;

    // [Insert] DB에 다이어그램 저장.
    await cmd.Add('diagram', diagram.serialize);

    return diagram;
}

export async function Update(
    diagram: DiagramsType.Instance,
    options: { isMementoPush?: boolean } = {}
) { 
    if(diagram.id === null) {return;}
    let old;

    _SPCE.Update(diagram);

    try {
        old = await _STOR.Post('diagram-select', diagram.id);
        // [DB] 스토리지 저장.
        await _STOR.Post('diagram-update', diagram.serialize);
    }
    catch(error) {
        console.error('[INSERT ERROR]: ', error);
        // [Space] 다이어그램 삭제.
        _SPCE.Delete(diagram);
        return;
    }
    
    // [Memento] 추가
    const isMementoPush = options.isMementoPush ?? true;
    if(isMementoPush) {
        const work = {
            before: old,
            after: diagram.serialize,
        };
        await _MNGR.memento.Exec('diagram', [work]);
    }
}
export async function UpdateBySerialize(
    serialize: DiagramsType.serialize.Union,
    options: { isMementoPush?: boolean } = {}
) {
    if(!serialize.axis.id) {return;}
    const diagram = _SPCE.store.Select(serialize.axis.id);
    if(diagram) {
        diagram.SetData(serialize);
        Update(diagram, options);
    }
}

export async function Delete(
    diagram: DiagramsType.Instance,
    options: { isMementoPush?: boolean } = {}
) { 
    if(diagram.id === null) {return;}
    
    // [Memento] 추가
    const isMementoPush = options.isMementoPush ?? true;
    if(isMementoPush) {
        const work = {
            before: diagram.serialize,
            after: null,
        };
        await _MNGR.memento.Exec('diagram', [work]);
    }

    try {
        // [DB] 스토리지 저장.
        await _STOR.Post('diagram-delete', diagram.id);

    }
    catch(error) {
        console.error('[ERROR]: ', error);
    }
    _SPCE.Delete(diagram);
}
export async function DeleteBySerialize(  
    serialize: DiagramsType.serialize.Union,
    options: { isMementoPush?: boolean } = {}
) {
    if(!serialize.axis.id) {return;}
    const diagram = _SPCE.store.Select(serialize.axis.id);
    if(diagram) {
        Delete(diagram, options);
    }
}
