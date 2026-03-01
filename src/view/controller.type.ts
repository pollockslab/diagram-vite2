import { type _DT } from '../diagrams/diagrams.type'

export namespace _CT
{
    export interface DOWN {
        target: _DT.CHILD_OBJECT;
        offsetX: number;
        offsetY: number;
        x: number;
        y: number;
        w: number;
        h: number;
        timeStamp: number;
        edge: _DT.EDGE_NAME | null;
    }
    export interface MOVE {
        x: number;
        y: number;
        isLoop: boolean;
    }
    export interface PINCH {
        distance: number; // 터치간 거리
        targets: Map<number, PointerEvent>;
    }
}

