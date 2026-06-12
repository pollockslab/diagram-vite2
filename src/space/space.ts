import * as Diagrams from '@/diagrams/diagrams'
import * as DiagramsType from '@/diagrams/diagrams.type'
import { SpaceStore } from './space.store'
import { SpaceGrid } from './space.grid'
import * as SpaceCollision from './space.collision'


/**
 * 좌표별로 관리해보자
 * 현재 위치랑 화면에서 그려야 할 위치. 근데 카메라 기준으로.
 * 몇블록을 그려야 할지. 화면에 보이는것 + 너무 몰려있을 경우 다 안그리고
 * 어떻게 최적화해서 안보여줄지 (이건 잘 모르겠음. 일단 다 그린느걸로)
 */
export class Space {
    
    id      : string = 'super';
    tabId   : string = 'super';   
    
    store       = new SpaceStore();
    grid        = new SpaceGrid();
    collision   = SpaceCollision;

    constructor() {}
    
    InitLoad(seiralizeSpace: DiagramsType.serialize.Union, serializeList: DiagramsType.serialize.Union[]) {
        // [Space] 기본정보 수정
        this.id = seiralizeSpace.axis.id ?? 'super';
        this.tabId = seiralizeSpace.axis.tabId ?? 'super';
        
        // [Diagrams] 다이어그램 생성
        const diagrams = [];
        for(const serialize of serializeList)  {
            const typeClass = (Diagrams.Class as any)[serialize.axis.type];
            const instance = new typeClass(serialize);
            diagrams.push(instance);
        }

        // [Init] 각 하위모듈 초기화
        this.store.Init();
        this.grid.Init();
        
        // [Insert] 각 하위모듈에게 생성한 다이어그램 입력
        this.store.Insert(diagrams);
        this.grid.Insert(diagrams);
    }

    Insert(input: DiagramsType.Instance | DiagramsType.Instance[]) {
        const list = Array.isArray(input)? input:[input];

        for(const diagram of list) {
            this.store.Insert(diagram);
            this.grid.Insert(diagram);
        }
    }

    Update(input: DiagramsType.Instance | DiagramsType.Instance[]) {
        const list = Array.isArray(input)? input:[input];

        for(const diagram of list) {
            this.store.Update(diagram);
            this.grid.Update(diagram);
        }
    }

    Delete(input: DiagramsType.Instance | DiagramsType.Instance[]) {
        const list = Array.isArray(input)? input:[input];

        for(const diagram of list) {
            this.store.Delete(diagram);
            this.grid.Delete(diagram);
        }
    }
}

