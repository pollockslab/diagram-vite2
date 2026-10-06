import { _VIEW, _TAB, _SPCE, _STOR, _MNGR } from '@/main'
import * as IndexeddbType from '@/engines/indexeddb/indexeddb.type'
import * as DiagramsType from '@/diagrams/diagrams.type'

import { SpaceGridCell } from '@/space/space.grid/space.grid.cell'
import * as SpaceType from '@/space/space.type'

/**
 * [필요 함수 목록]
 * [space]
 * 1. LoadTX() // Init 개념으로. 현재 tab.open.space.id, view(x,y) 기준으로 동기화.
 * 2. 
 * 
 * [space.grid]
 * 1. SelectTX() // 그리드 조회해오기. 그리드 관련 diagrams 은
 */
export async function Load(): Promise<void> {
    await _STOR.Transaction(['space_grid', 'diagram'], 'readwrite', async (cmd) => {
        await LoadTX(cmd);
    });
}
export async function LoadTX(cmd: IndexeddbType.StoreCommand): Promise<void> {
    await LoadOpenTX(cmd);
    await LoadViewTX(cmd);
}

export async function LoadOpenTX(cmd: IndexeddbType.StoreCommand): Promise<void> {
    _SPCE.Init();
    let select;

    // [Insert] 탭에서 오픈 스페이스 ID 확인. 없을 경우 생성.
    if(!_TAB.open.space.id) {
        const diagram = await InsertOpenTX(cmd, null);
        select = diagram.serialize;
    }
    else {
        select = await cmd.Get('diagram', _TAB.open.space.id);
        // [Validation] 조회정보 없을 시, 새로생성.
        if(!select) {
            const diagram = await InsertOpenTX(cmd, null);
            select = diagram.serialize;
        }
    }
    // [Update] Space 모듈에 값 반영.
    _SPCE.id = select.axis.id;
    
    // [Update] Tab 모듈에 값 반영.
    _TAB.open.space.id = select.axis.id;
}

/**
 * [Function] LoadViewTX
 * @description
 * 현재 화면(view rect)에 보이는 영역의 그리드 셀과, 셀에 속한 다이어그램을
 * IDB에서 읽어 _SPCE(메모리)에 올린다.
 *
 * [전제]
 * - 메모리(_SPCE)에 있는 값은 항상 최신이다.
 *   수정은 UpdateTX가 IDB와 메모리를 함께 갱신하므로, LoadViewTX는 변경 여부를 비교하지 않는다.
 *   (다중 탭이나 서버 동기화처럼 IDB가 외부에서 바뀌는 경우가 생기면
 *    이 전제가 깨지므로 axis.version 비교를 추가해야 한다.)
 * - 따라서 "메모리에 없는 것만" 읽어서 올린다. 이미 있는 셀/다이어그램은 건드리지 않는다.
 * - _SPCE.grid.Has(point)는 "내용이 있다"가 아니라 "이 좌표를 이미 조회했다"는 뜻이다.
 *
 * [흐름]
 * 1. view rect를 그리드 셀 좌표 목록으로 변환한다. (GetCellPoints)
 * 2. 메모리에 없는 좌표만 IDB(space_grid)에서 조회한다.
 * 3. IDB에 셀이 있으면, 셀이 가진 다이어그램 id 중 메모리에 없는 것만 IDB(diagram)에서 조회해
 *    인스턴스로 만들어 _SPCE.diagrams에 저장한다.
 * 4. 셀을 _SPCE.grid에 저장한다.
 *    IDB에 셀이 없으면 빈 셀, 있으면 내용을 채운 셀을 저장한다.
 *    (다이어그램을 먼저 올린 뒤 셀을 저장하므로, 셀이 있으면 그 다이어그램도 메모리에 있다.)
 *
 * [주의]
 * - 빈 셀은 메모리에만 있고 IDB에는 레코드가 없다.
 *   UpdateTX는 이 셀에 처음 쓸 때 IDB에 새로 put(upsert) 해야 한다.
 * - 셀에 적힌 다이어그램 id가 diagram 스토어에 없으면 데이터 불일치이므로 throw 한다.
 *
 * @param cmd IDB 트랜잭션 커맨드
 * @throws space.id가 없거나, 셀이 참조하는 다이어그램이 IDB에 없을 때
 */
export async function LoadViewTX(cmd: IndexeddbType.StoreCommand): Promise<void> {
    if(!_SPCE.id) {throw new Error('space.id is not found.')}

    // [1] view rect → 그리드 셀 좌표 목록
    const cellPoints = _MNGR.space_grid.GetCellPoints(_VIEW.GetRect());

    for(const point of cellPoints) {
        // [2] 이미 조회한 좌표는 IDB 조회 생략 (메모리가 최신이라는 전제)
        if(_SPCE.grid.Has(point)) {continue;}

        const gridCell = new SpaceGridCell();
        const select: undefined | SpaceType.serialize.Grid = await cmd.GetByIndex('space_grid', 'grid', [point[0], point[1], _SPCE.id]);

        // IDB에 셀이 있으면: 다이어그램을 먼저 올리고, 셀에 내용을 채운다
        if(select) {
            // [3] Diagrams: 셀의 자식 다이어그램 중 메모리에 없는 것만 올리기
            for(const diagramID of select.children.diagram.list) {
                if(_SPCE.diagrams.has(diagramID)) {continue;}
                const serialize = await cmd.Get('diagram', diagramID);
                if(!serialize) {
                    throw new Error(`diagram is not found. diagrams.id: '${diagramID}'`);
                }
                _SPCE.diagrams.set(diagramID, _MNGR.diagram.Create(serialize));
            }
            gridCell.serialize = select;
        }
        // [4] Grid: IDB에 없으면 빈 셀 그대로, 있으면 채운 셀을 저장 (조회 완료 표시)
        _SPCE.grid.Set(point, gridCell);
    }
}

/**
 * [Function] InsertOpenTX
 * @description Space 모듈이 참조하는 Diagram 생성 (부모 X, 자기자신 O)
 * @param cmd IDB.Transaction
 * @param parentDiagramID 부모 Diagram ID
 * @returns 생성된 Diagram (부모 X, 자기자신 O)
 */
async function InsertOpenTX(
    cmd: IndexeddbType.StoreCommand,
    parentDiagramID: DiagramsType.ID,
): Promise<DiagramsType.Instance> {
    if(!_TAB.id) {throw new Error('tab.id is not found.');}

    // [Insert] 다이어그램 생성.
    const diagram = await _MNGR.diagram.InsertTX(
        cmd, 
        {
            type: 'Axis',
            parent: {
                diagram: {
                    id: parentDiagramID,
                },
                tab: {
                    id: _TAB.id,
                },
            },
        }
    );
    return diagram;
}

