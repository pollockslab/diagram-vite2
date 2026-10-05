import { _MNGR } from '@/main'
import { MultiKeyMap } from '@/engines/multikeymap/multikeymap'
import * as DiagramsType from '@/diagrams/diagrams.type'
import { SpaceGridCell } from './space.grid/space.grid.cell'
import * as SpaceCollision from './space.collision'
import * as SpaceType from './space.type'


export class Space {
    id: SpaceType.ID = null;
    // NOTE: 체인 <- 그리드에 포함필요 (기울기로 구할까?)
    collision = SpaceCollision;
    grid = new MultiKeyMap();
    diagrams: Map<string, DiagramsType.Instance> = new Map();
    
    constructor() {}
    
    Init() {
        this.id = null;
        this.grid.DeleteAll();
        this.diagrams.clear();
    }


    Update(col: number, row: number, serialize: SpaceType.serialize.Grid) {
        const cell = new SpaceGridCell();
        cell.serialize = serialize;
        this.grid.Set([col, row], cell);

        // [Diagrams]
        // cell 의 목록을 추출해서 나온 다이어그램객체를 넣어야되는데
        // manager 에서 조회해서 가져와야되는데
        // 매번 전부 조회는 안되고. 어떻게 연산 덜할까

        // 파라미터로 받으면,
        // 기존에 있던 다이어그램인지 먼저 확인후에,
        // 있다면, 변경된게 있는지 체크.
        // 없으면 continue;
        // 있으면 체크해야지

    }

    Delete(id: string) {

    }
}

