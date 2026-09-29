import { _MNGR } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'
import { SpaceStore } from './space.store'
import { SpaceGrid } from './space.grid/space.grid'
import * as SpaceCollision from './space.collision'
import * as SpaceType from './space.type'


/**
 * 좌표별로 관리해보자
 * 현재 위치랑 화면에서 그려야 할 위치. 근데 카메라 기준으로.
 * 몇블록을 그려야 할지. 화면에 보이는것 + 너무 몰려있을 경우 다 안그리고
 * 어떻게 최적화해서 안보여줄지 (이건 잘 모르겠음. 일단 다 그린느걸로)
 */
export class Space {
    id: SpaceType.ID = null;

    store       = new SpaceStore();
    grid        = new SpaceGrid(); // 이 구조면 안되고, 다중 구조로
    
    collision   = SpaceCollision;

    constructor() {}

    static get origin(): SpaceType.serialize.Space {
        return {
            space: {
                id: null,
            },
            grid: SpaceGrid.origin,
        }
    }
    get serialize(): SpaceType.serialize.Space {
        return {
            space: {
                id: this.id,
            },
            grid: this.grid.serialize,
        };
    }
    set serialize(data: SpaceType.serialize.Space) {
        this.id = data.space.id;
        this.grid.serialize = data.grid;
    }
    Init() {
        this.serialize = Space.origin;
    }
    
    // 기능 분리하자 ( Init, 하고 나머지 Insert 로 넣기)
    // InitLoad(seiralizeSpace: DiagramsType.serialize.Union, serializeList: DiagramsType.serialize.Union[]) {
    InitLoad(seiralizeSpace: SpaceType.serialize.Space, serializeList: DiagramsType.serialize.Union[]) {
        // [Space] 기본정보 수정
        this.spaceID = seiralizeSpace.id.space ?? 'super';
        this.tabID   = seiralizeSpace.id.tab   ?? 'super';
        
        // [Diagrams] 다이어그램 생성
        const diagrams = [];
        for(const serialize of serializeList) {
            const instance = _MNGR.diagram.Cover(serialize);
            if(!instance) {continue;}
            // console.log(instance)
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

