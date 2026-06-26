import { _SPCE } from '@/main'
import * as Diagrams from '@/diagrams/diagrams'
import * as DiagramsType from '@/diagrams/diagrams.type'
import * as SpaceType from './space.type'

const edge = {
    arrow: new Set(['e','w','s','n','es','en','ws','wn']),
    cursor: new Map<string, string>([
        // 단방향 (상하좌우)
        ['n', 'ns-resize'],
        ['s', 'ns-resize'],
        ['e', 'ew-resize'],
        ['w', 'ew-resize'],
        
        // 쌍방향 축 축약형 대응
        ['ns', 'ns-resize'],
        ['ew', 'ew-resize'],
        
        // 대각선 방향 (북동-남서, 북서-남동)
        ['ne', 'nesw-resize'],
        ['sw', 'nesw-resize'],
        ['nw', 'nwse-resize'],
        ['se', 'nwse-resize'],
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

export function Edge3(diagram: DiagramsType.Instance, x: number, y: number)
: undefined | 
{
    arrow : DiagramsType.Edge,
    cursor: DiagramsType.Edge 
} {
    // [Validation] Square 를 상속받은 다이어그램이 아니면 리턴
    if(!(diagram instanceof Diagrams.Class.Square)) {return;}

    const isArrow = {
        w: false,
        e: false,
        n: false, 
        s: false,
    };
    
    // [Validaion] 사각형 외각선에서 안쪽으로 10픽셀 사이에 포인트가 있는지 확인
    let copy = '';

    // [West]
    if(Math.abs(x -  diagram.x             ) <= 5) {copy += 'e';}
    // [East]
    if(Math.abs(x - (diagram.x + diagram.w)) <= 5) {copy += 'w';}
    // [North]
    if(Math.abs(y -  diagram.y             ) <= 5) {copy += 'n';}
    // [South]
    if(Math.abs(y - (diagram.y + diagram.h)) <= 5) {copy += 's';}
    
    // [Copy]
    const arrow = (!edge.arrow.has(copy))? null : copy;

    // 2. 커서까지 포함해서 보내자
    let cursor: DiagramsType.Edge = null;
    if(arrow === 'e' || arrow === 'w') {cursor = 'ew'}
    else if(arrow === 'n' || arrow === 's') {cursor = 'ns'}
    else if(arrow === 'es' || arrow === 'wn') {cursor = 'nwse'}
    else if(arrow === 'en' || arrow == 'ws') {cursor = 'nesw'}

    return {
arrow, cursor};
}

export function Edge2(diagram: DiagramsType.Instance, x: number, y: number)
: undefined | 
{
    arrow : DiagramsType.Edge,
    cursor: DiagramsType.Edge 
} {
    // [Validation] Square 를 상속받은 다이어그램이 아니면 리턴
    if(!(diagram instanceof Diagrams.Class.Square)) {return;}

    // const arrow = {
    //     w: false,
    //     e: false,
    //     n: false, 
    //     s: false,
    // };
    
    // // [Validaion] 사각형 외각선에서 안쪽으로 10픽셀 사이에 포인트가 있는지 확인
    // // [West]
    // if(Math.abs(x -  diagram.x             ) <= 5) {arrow.w = true;}
    // // [East]
    // if(Math.abs(x - (diagram.x + diagram.w)) <= 5) {arrow.e = true;}
    // // [North]
    // if(Math.abs(y -  diagram.y             ) <= 5) {arrow.n = true;}
    // // [South]
    // if(Math.abs(y - (diagram.y + diagram.h)) <= 5) {arrow.s = true;}

    
    // [Validaion] 사각형 외각선에서 안쪽으로 10픽셀 사이에 포인트가 있는지 확인
    let copy = '';

    // [West]
    if(Math.abs(x -  diagram.x             ) <= 5) {copy += 'e';}
    // [East]
    if(Math.abs(x - (diagram.x + diagram.w)) <= 5) {copy += 'w';}
    // [North]
    if(Math.abs(y -  diagram.y             ) <= 5) {copy += 'n';}
    // [South]
    if(Math.abs(y - (diagram.y + diagram.h)) <= 5) {copy += 's';}
    
    // [Copy]
    const arrow: DiagramsType.Edge = (copy === '')? null : copy as DiagramsType.Edge;

    // 2. 커서까지 포함해서 보내자
    let cursor: DiagramsType.Edge = null;
    if(arrow === 'e' || arrow === 'w') {cursor = 'ew'}
    else if(arrow === 'n' || arrow === 's') {cursor = 'ns'}
    else if(arrow === 'es' || arrow === 'wn') {cursor = 'nwse'}
    else if(arrow === 'en' || arrow == 'ws') {cursor = 'nesw'}

    return {
arrow, cursor};
}

export function Edge(diagram: DiagramsType.Instance, x: number, y: number)
: undefined | {arrow : DiagramsType.Edge, cursor: DiagramsType.Edge} {
    // [Validation] Square 를 상속받은 다이어그램이 아니면 리턴
    if(!(diagram instanceof Diagrams.Class.Square)) {return;}

    // [Arrow]
    let arrow: DiagramsType.Edge = null;
    let copy = '';

    // [Validaion] 사각형 외각선에서 안쪽으로 10픽셀 사이에 포인트가 있는지 확인
    // [West]
    if(Math.abs(x -  diagram.x             ) <= 5) {copy += 'e';}
    // [East]
    if(Math.abs(x - (diagram.x + diagram.w)) <= 5) {copy += 'w';}
    // [North]
    if(Math.abs(y -  diagram.y             ) <= 5) {copy += 'n';}
    // [South]
    if(Math.abs(y - (diagram.y + diagram.h)) <= 5) {copy += 's';}

    for(const edge of Diagrams.Edge) {
        if(edge === copy) {arrow = copy;}
    }
   
    // [Cursor]
    let cursor: DiagramsType.Edge = null;
    if(arrow === 'e' || arrow === 'w') {cursor = 'ew'}
    else if(arrow === 'n' || arrow === 's') {cursor = 'ns'}
    else if(arrow === 'es' || arrow === 'wn') {cursor = 'nwse'}
    else if(arrow === 'en' || arrow == 'ws') {cursor = 'nesw'}

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

