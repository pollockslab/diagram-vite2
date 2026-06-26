import { _SPCE } from '@/main'
import * as Diagrams from '@/diagrams/diagrams'
import * as DiagramsType from '@/diagrams/diagrams.type'
import * as SpaceType from './space.type'
import { Space } from './space'

const edge = {
    arrow: new Set(['e','w','s','n','es','en','ws','wn']),
    cursor: new Map<string, string>([
        // 단방향 (상하좌우)
        ['e', 'ew-resize'],
        ['w', 'ew-resize'],
        ['s', 'ns-resize'],
        ['n', 'ns-resize'],
        
        // 대각선 방향 (북동-남서, 북서-남동)
        ['es', 'nesw-resize'],
        ['en', 'nwse-resize'],
        ['ws', 'nwse-resize'],
        ['wn', 'nesw-resize'],
    ]),
} 

// 멀티버스여서 좌표가 겹칠 수 있으나 서로 다른우주면 같은공간에서 겹치는게 아니기 때문에
// 같은 공간인 스페이스에서 콜리전 체크가 개념상 맞다

export function Point(x: number, y: number): DiagramsType.Instance[] {
    // [Grid] 조회
    const grid = _SPCE.grid.SelectByPoint(x, y);

    // [Store] 조회
    const store = _SPCE.store.SelectByList(grid);

    // [Check] (x, y) 좌표에 있는 다이어그램만 옮겨담기
    const check = [];
    for(const diagram of store) {
        if (diagram instanceof Diagrams.Class.Line) {
        }
        else if(diagram instanceof Diagrams.Class.Square) {
            if(CheckSquare(x, y, diagram.x, diagram.y, diagram.w, diagram.h)) {
                check.push(diagram);
            }
        }
        else if(diagram instanceof Diagrams.Class.Point) {
        }
    }
    return check;
}

export function PointFront(x: number, y: number): undefined | DiagramsType.Instance {
    // [Grid] 조회
    const grid = _SPCE.grid.SelectByPoint(x, y);

    // [Store] 조회
    const store = _SPCE.store.SelectByList(grid);

    // [Check] (x, y) 좌표에 있는 다이어그램 찾기
    for(let i=store.length-1; i>=0; i--) {
        const diagram = store[i];
        if (diagram instanceof Diagrams.Class.Line) {
        }
        else if(diagram instanceof Diagrams.Class.Square) {
            if(CheckSquare(x, y, diagram.x, diagram.y, diagram.w, diagram.h)) {
                return diagram;
            }
        }
        else if(diagram instanceof Diagrams.Class.Point) {
        }
    }
}

export function Edge(diagram: DiagramsType.Instance, x: number, y: number)
: undefined | SpaceType.Edge {
    // [Validation] Square 를 상속받은 다이어그램이 아니면 리턴
    if(!(diagram instanceof Diagrams.Class.Square)) {return;}

    // [Arrow] 사각형 외각선에서 안쪽으로 10픽셀 사이에 포인트가 있는지 확인
    let temp = '';
    // [West]
    if(Math.abs(x -  diagram.x             ) <= 5) {temp += 'w';}
    // [East]
    if(Math.abs(x - (diagram.x + diagram.w)) <= 5) {temp += 'e';}
    // [North]
    if(Math.abs(y -  diagram.y             ) <= 5) {temp += 'n';}
    // [South]
    if(Math.abs(y - (diagram.y + diagram.h)) <= 5) {temp += 's';}
    console.log('d')
    // [Validation] 0x0 크기의 사각형을 비교할 경우. 상하좌우 위치가 겹쳐서 오류. (예: ewns)
    if(!edge.arrow.has(temp)) {return;}
    const arrow = temp as SpaceType.EdgeArrow;

    // [Cursor] 양방향 화살표 커서모양 확인
console.log('temp', arrow)
    const cursor = edge.cursor.get(arrow) as SpaceType.EdgeCursor;
    console.log('dddddd,', cursor)
    if(!cursor) {return;}

    return {arrow, cursor};
}

export function Square(x: number, y: number, w: number, h: number): DiagramsType.Instance[] {
    // [Grid] 조회
    const grid = _SPCE.grid.SelectBySquare(x, y, w, h);

    // [Store] 조회
    const store = _SPCE.store.SelectByList(grid);

    return store;
}

export function CheckSquare(posX: number, posY: number, x: number, y: number, w: number, h: number): boolean {
    return (
        posX >= x &&
        posX <= x + w &&
        posY >= y &&
        posY <= y + h
    );
    
}

