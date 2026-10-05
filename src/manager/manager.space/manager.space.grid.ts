import { _VIEW, _TAB, _SPCE, _STOR, _MNGR } from '@/main'
import { MultiKeyMap } from '@/engines/multikeymap/multikeymap'
import * as IndexeddbType from '@/engines/indexeddb/indexeddb.type'
import * as DiagramsType from '@/diagrams/diagrams.type'
import { SpaceGridCell } from '@/space/space.grid/space.grid.cell'
import * as ViewType from '@/view/view.type'

const GRID_WIDTH  = SpaceGridCell.GRID_WIDTH;
const GRID_HEIGHT = SpaceGridCell.GRID_HEIGHT;



export function GetCellPoints(rect: ViewType.GetRect): [number, number][] {
    const range = {
        left    : Math.floor(rect.left/GRID_WIDTH)*GRID_WIDTH,
        right   : Math.floor(rect.right/GRID_WIDTH)*GRID_WIDTH,
        top     : Math.floor(rect.top/GRID_HEIGHT)*GRID_HEIGHT,
        bottom  : Math.floor(rect.bottom/GRID_HEIGHT)*GRID_HEIGHT,
    };
    const points: [number, number][] = [];
    for (let y = range.top; y <= range.bottom; y += GRID_HEIGHT) {
        for (let x = range.left; x <= range.right; x += GRID_WIDTH) {
            points.push([x, y]);
        }
    }
    return points;
}


async function AddChildTX(
    cmd: IndexeddbType.StoreCommand,
    grid: MultiKeyMap, 
    diagrams: Set<string>,
    row: number, col: number,
){
    if(!_SPCE.id) {throw new Error('space.id is not found.')}

    const diagram = await _MNGR.diagram.InsertTX(
        cmd,
        {
            type: 'Rect',
            rect: {
                x: row, 
                y: col,
            },
        },
    );
    if(!diagram.id) {return;}
    // console.log(diagram)
    // diagrams.add(id);
    const origin = SpaceGridCell.origin;
    origin.space_grid.id = crypto.randomUUID();
    origin.space_grid.x1000 = row;
    origin.space_grid.y1000 = col;
    origin.children.diagram.list = [diagram.id];
    origin.self.diagram.id = _SPCE.id;
    // console.log(origin);

    await cmd.Add('space_grid', origin);
    console.log('여기 조회', await cmd.Get('space_grid', origin.space_grid.id));
    const selectIndex = await cmd.GetByIndex('space_grid', 'grid', [row, col,  _SPCE.id]);
    console.log('여기 조회222', selectIndex);
}

async function UpdateTX(
    cmd: IndexeddbType.StoreCommand,
    col: number, 
    row: number,
    serialize: DiagramsType.ID,
){
    if(!_SPCE.id) {throw new Error('space.id is not found.')}

    // 1. 먼저 조회해보기. 
    let select = await cmd.GetByIndex('space_grid', 'grid', [col, row, _SPCE.id]);

    // 2. 없으면 새로 생성하기
    if(!select) {
        const origin = SpaceGridCell.origin;
        origin.space_grid.id = crypto.randomUUID();
        origin.self.diagram.id = _SPCE.id;
        
        await cmd.Add('space_grid', origin);
        select = origin;
    }

    // 3. 있으면 정보 업데이트

    // 근데 _SPCE 모듈에서도 있는지 확인해야되지 않나.
    // 꼬였어. IDB 에서 먼저 찾을지, _SPCE 에서 먼저 찾을지,
    // 생각1: 다이어그램 드래그 했을때 여기 호출되냐?
    // manager.controller 에서 전체 총괄하며, 이 함수도 호출되려나
    // 거기서 manager.diagram.update 도 호출하고?
    // 여기서 해줄껀? before, after 정보를 그리드에 반영해줘야해
    // 그럼 뭘 받아야되냐? 다이어그램? 목록?
    // 여튼 하나의 다이어그램을 받던 뭔가 받아야되는데
}