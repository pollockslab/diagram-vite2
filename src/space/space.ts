import { _MNGR } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'
import { SpaceStore } from './space.store'
import { SpaceGrid } from './space.grid'
import * as SpaceCollision from './space.collision'
import * as SpaceType from './space.type'


/**
 * 좌표별로 관리해보자
 * 현재 위치랑 화면에서 그려야 할 위치. 근데 카메라 기준으로.
 * 몇블록을 그려야 할지. 화면에 보이는것 + 너무 몰려있을 경우 다 안그리고
 * 어떻게 최적화해서 안보여줄지 (이건 잘 모르겠음. 일단 다 그린느걸로)
 */
export class Space {
    space = {
        id: {
            space: 'super',
            tab: 'super',
        },
    };
    store       = new SpaceStore();
    grid        = new SpaceGrid();
    collision   = SpaceCollision;

    constructor() {}

    get serialize(): SpaceType.serialize.Space {
        /**
         * 예시로 들면, 학생, 학생의 책가방 테이블을 따로 만들면
         *  1. 학생을 지우면 책가방도 지워야 한다
         *  2. 학생 업데이트나 새로생성때 책가방 생성이나 수정필요가 없다
         *  4. 그럼 책가방은 학생의 아이디만 
         *  위험상황 : 다이어그램 객체를 스페이스 모듈에서 가지고 있는중에
         *  다이어그램을 다른 스페이스에서 수정할경우 문제
         *  ㄴ 브라우저 다른탭에서 열어서 수정하면
         *  그리드 격자 하나마다 테이블의 행데이터로 만들어야 의미가 있어보이는데.
         *  무한확장인데 다이어그램 이동했는데 스페이스 디비에 업데이트 하면
         *  그리드 무한확장인데 어떻게 매번 다시저장하나. 비포 에프타 그리드만 수정해야
         */
        return {
            id: {
                space: this.spaceID,
                tab: this.tabID,
            },
            grid: {},
        };
    }
    set serialize(value: SpaceType.serialize.Space) {
        console.log(value);
    }

    get spaceID() {
        return this.space.id.space;
    }
    set spaceID(value: string) {
        this.space.id.space = value;
    }

    get tabID() {
        return this.space.id.tab;
    }
    set tabID(value: string) {
        this.space.id.tab = value;
    }
    
    // 기능 분리하자 ( Init, 하고 나머지 Insert 로 넣기)
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

