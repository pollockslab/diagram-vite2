import * as Diagrams from '@/diagrams/diagrams'
import * as DiagramsType from '@/diagrams/diagrams.type'
import { SpaceGrid } from './space.grid'
import * as SpaceType from './space.type'
import * as SpaceCollision from './space.collision'

/**
 * 좌표별로 관리해보자
 * 현재 위치랑 화면에서 그려야 할 위치. 근데 카메라 기준으로.
 * 몇블록을 그려야 할지. 화면에 보이는것 + 너무 몰려있을 경우 다 안그리고
 * 어떻게 최적화해서 안보여줄지 (이건 잘 모르겠음. 일단 다 그린느걸로)
 */
export class Space {
    
    map = {
        id: 'super' as string,
        tabId: 'super' as string,
    };
    grid        = new SpaceGrid();
    children    = this.NewChildren();
    collision   = SpaceCollision;

    constructor() {}

    get id() {
        return this.map.id;
    }
    set id(value: string) {
        this.map.id = value;
    }
    get tabId() {
        return this.map.tabId;
    }
    set tabId(value: string) {
        this.map.tabId = value;
    }

    
    private NewChildren(): SpaceType.Children {
        return {
            none:   [] as DiagramsType.Instance[],
            line:   [] as DiagramsType.Instance[],
            square: [] as DiagramsType.Instance[],
            point:  [] as DiagramsType.Instance[],
        };
    }
    ClearAll() {
        this.children = this.NewChildren();
        this.grid.ClearAll();
    }
    
    Select(id: string): null|DiagramsType.Instance {
        for(let i = this.children.point.length-1; i >= 0; i--) {
            const child = this.children.point[i];
            if(child.id === id) {return child;}
        }
        for(let i = this.children.square.length-1; i >= 0; i--) {
            const child = this.children.square[i];
            if(child.id === id) {return child;}
        }
        for(let i = this.children.line.length-1; i >= 0; i--) {
            const child = this.children.line[i];
            if(child.id === id) {return child;}
        }
        return null;
    }
    
    SelectArea(x1: number, y1: number, x2: number, y2: number): DiagramsType.Instance[] {
        const gridList = this.grid.SelectArea(x1, y1, x2, y2);
        const instanceList: DiagramsType.Instance[] = [];

        // 1. 필요한 데이터만 모으기
        for (const id of gridList ?? []) {
            const instance = this.Select(id);
            if (instance) instanceList.push(instance);
        }

        // 2. zIndex 기준으로 한 번만 정렬 (이게 정답입니다)
        instanceList.sort((a, b) => a.zIndex - b.zIndex);

        // 3. 정렬된 순서대로 children에 분류
        const children = this.NewChildren();
        for (const instance of instanceList) {
            if (instance instanceof Diagrams.Class.Line) children.line.push(instance);
            else if (instance instanceof Diagrams.Class.Square) children.square.push(instance);
            else if (instance instanceof Diagrams.Class.Point) children.point.push(instance);
        }

        return [...children.line, ...children.square, ...children.point];
    }

    Insert(diagram: DiagramsType.Instance) {
        const list = this.GetList(diagram); 
        list.push(diagram);
        this.grid.Update(diagram);
    }

    Update(diagram: DiagramsType.Instance) {
        this.grid.Update(diagram);
    }

    Delete(serialize: DiagramsType.serialize.Union) {
        console.log('디리트');
        if(!serialize.axis.id) {return;}
        const instance = this.Select(serialize.axis.id);
        if(!instance) {return;}
        const list = this.GetList(instance);
        const index = list.indexOf(instance);
        if(index === -1) {return;}
        list.splice(index, 1);

        console.log('디리트 찾았다')
        this.grid.Delete(instance);
    }

    private GetList(diagram: DiagramsType.Instance): DiagramsType.Instance[] {
         // 라인같은경우 곡선, 직선, 지그재그 등 기능이면 이 위에 추가로
        if(diagram instanceof Diagrams.Class.Line) {
            return this.children.line;
        }
        else if(diagram instanceof Diagrams.Class.Square) {
            return this.children.square;
        }
        else if(diagram instanceof Diagrams.Class.Point) {
            return this.children.point;
        }
        else {
            return this.children.none;
        }
    }

    InitLoad(list: DiagramsType.serialize.Union[]) {
        
        console.log('list', list);

        for(const serialize of list)  {
            // [Instance] 다이어그램 생성
            const typeClass = (Diagrams.Class as any)[serialize.axis.type];
            const instance = new typeClass(serialize);
            
            // 리스트 좀 바꾸고 그냥 바로 입력으로 변경하자
            const list = this.GetList(instance); 
            list.push(instance);
            this.grid.Update(instance);
        }
    }
}

