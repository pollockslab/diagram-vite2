import { _TAB, _SPCE, _STOR, _MNGR } from '@/main'
import * as IndexeddbType from '@/engines/indexeddb/indexeddb.type'
import * as DiagramsType from '@/diagrams/diagrams.type'

/**
 * [필요 함수 목록]
 * 1. Load() // 필요정보: space.id, x, y
 * 2. 
 */
export async function Load(): Promise<void> {
    await _STOR.Transaction(['space_grid', 'diagram'], 'readwrite', async (cmd) => {
        await LoadTX(cmd);
    });
}
export async function LoadTX(cmd: IndexeddbType.StoreCommand): Promise<void> {
    _SPCE.Init();
    let select;

    // [Insert] 탭에서 오픈 스페이스 ID 확인. 없을 경우 생성.
    if(!_TAB.open.space.id) {
        select = await InsertTX(cmd, 'Axis', null);
    }
    else {
        select = await cmd.Get('diagram', _TAB.open.space.id);
        // [Validation] 조회정보 없을 시, 새로생성.
        if(!select) {
            select = await InsertTX(cmd, 'Axis', null);
        }
    }
    // [Update] Space 모듈에 값 반영.
    _SPCE.id = select.id;

    // [Update] Tab 모듈에 값 반영.
    _TAB.open.space.id = select.id;
}

export async function InsertTX(
    cmd: IndexeddbType.StoreCommand,
    diagramType: DiagramsType.ClassName,
    parentDiagramID: DiagramsType.ID,
): Promise<DiagramsType.Instance> {
    if(!_TAB.id) {throw new Error('tab.id is not found.');}

    // [Insert] 다이어그램 생성.
    const diagram = await _MNGR.diagram.InsertTX(cmd, {
        type: diagramType,
        parent: {
            diagram: {
                id: parentDiagramID,
            },
            tab: {
                id: _TAB.id,
            },
        },
    });
    return diagram;
}

