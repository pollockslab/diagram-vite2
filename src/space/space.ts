import { _MNGR } from '@/main'
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
    
    diagram : null | DiagramsType.Instance = null;
    id      : string = 'super';
    tabId   : string = 'super';   
    
    store       = new SpaceStore();
    grid        = new SpaceGrid();
    collision   = SpaceCollision;
a // diagram 에 space 맵 다이어그램 객체 넣고 거기에서 id, tabId 매번넣고
// 목록을 거기서 불러오자. 저장도 하고, 수정도 하고. 좌표 바뀌면 좌표를 저장해야되는데
// 근데 redo undo 가 까다롭나? 까다로울게 뭐있나.
// 그럼 grid 를 시리얼라이즈 해서 저장시킬수 있어야해
// 게다가 포인트나, 선은 필요 없으니 사각형만 할까 생각하다가
// 그냥 axis 에 구현해놓는게 나을수도 있겠다
    constructor() {}
    
    InitLoad(seiralizeSpace: DiagramsType.serialize.Union, serializeList: DiagramsType.serialize.Union[]) {
        // [Space] 기본정보 수정
        this.id = seiralizeSpace.axis.id ?? 'super';
        this.tabId = seiralizeSpace.axis.tabId ?? 'super';
        
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

