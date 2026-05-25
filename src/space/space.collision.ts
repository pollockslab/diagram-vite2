
import * as DiagramsType from '@/diagrams/diagrams.type'

// 멀티버스여서 좌표가 겹칠 수 있으나 서로 다른우주면 같은공간에서 겹치는게 아니기 때문에
// 같은 공간인 스페이스에서 콜리전 체크가 개념상 맞다

export function Point(x: number, y: number): Array<DiagramsType.Instance> {
    // 1. 해당 그리드 체크
    // 2. 그리드 내에서 콜리전 되는 다이어그램 목록 z-index 순서대로 목록에 저장
    // 3. 목록 리턴
    console.log(x, y);
    return [];
}


export function Square(x: number, y: number, w: number, h: number) {
    console.log(x, y, w, h);
}

export function Check(x: number, y: number): boolean {
    // const axis: DiagramsType.Instance = null;
    // return (
    //     x >= axis.x &&
    //     x <= axis.x + axis.w &&
    //     y >= axis.y &&
    //     y <= axis.y + axis.h
    // );
    console.log(x, y);
    return false;
}

