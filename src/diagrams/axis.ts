

// 1. 자식 객체가 가질 최소한의 인터페이스 정의
interface DiagramItem {
    id: string;
    type: string;
    [key: string]: any; // 그 외 데이터들
}

// 2. children 객체의 구조 정의
interface ChildrenStructure {
    none: DiagramItem[];
    point: DiagramItem[];
    square: DiagramItem[];
    line: DiagramItem[];
    button: DiagramItem[];
    [key: string]: DiagramItem[]; // 혹시 모를 확장을 위해 인덱스 시그니처 추가
}

export class _MAIN {
    type: string = 'none';
    x: number = 0;
    y: number = 0;
    w: number = 0;
    h: number = 0;
    
    _capture: {
        cav: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D | null;
    };

    // 초기값 할당 및 타입 지정
    children: ChildrenStructure = {
        none: [],
        point: [],
        square: [],
        line: [],
        button: [],
    };

    constructor(args: Partial<_MAIN> = {}) {
        const cav = document.createElement('canvas');
        const ctx = cav.getContext('2d');
        this._capture = { cav, ctx };
        
        // 데이터가 넘어왔다면 바로 초기화
        this.SetData(args);
    }

    InitChildren() {
        this.children = {
            none: [],
            point: [],
            square: [],
            line: [],
            button: [],
        };
    }

    SetData(args: Partial<_MAIN> = {}) {
        Object.assign(this, args);
    }

    // FindByID에서 에러 안 나게 처리하는 법
    FindByID(diagramID: string): DiagramItem | null {
        // key를 꺼내서 접근할 때 TS 에러를 피하려면 Object.keys 대신 values가 속 편합니다.
        const allLists = Object.values(this.children);

        for (const list of allLists) {
            const found = list.find(item => item.id === diagramID);
            if (found) return found;
        }
        return null;
    }
}