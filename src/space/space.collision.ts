import { _SPCE } from '@/main'
import * as Diagrams from '@/diagrams/diagrams'
import * as DiagramsType from '@/diagrams/diagrams.type'


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

