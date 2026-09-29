import { _MNGR } from '@/main'
import { MultiKeyMap } from '@/engines/multikeymap/multikeymap'
import * as DiagramsType from '@/diagrams/diagrams.type'
import { SpaceGrid } from './space.grid/space.grid'
import { SpaceDiagrams } from './space.diagrams'
import * as SpaceCollision from './space.collision'
import * as SpaceType from './space.type'


export class Space {
    id: SpaceType.ID = null;
    // NOTE: 체인 <- 그리드에 포함필요 (기울기로 구할까?)
    grid        = new MultiKeyMap();
    diagrams    = new SpaceDiagrams();
    collision   = SpaceCollision;
   
    
    constructor() {}
    
    Init() {
        this.id = null;
        this.grid.DeleteAll();
        this.diagrams.Init();
    }

    Select(id: string) {

    }

    Insert(diagram: DiagramsType.Instance) {

    }

    // Update (필요한가? 외부에서 직접수정 못해. 그리드 바꼈나도 봐야해서.)
    // ㄴ manager.space 에서 diagram 수정해서 파라미터로 건네주자
    Update(diagram: DiagramsType.Instance) {

    }

    Delete(id: string) {

    }
}

