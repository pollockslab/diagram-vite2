
import {_MAIN as _AXIS} from './axis'
import {_MAIN as _SQUARE} from './square'

const _D_CLASS = {
    axis: _AXIS,
    // point: null,
    square: _SQUARE,
    // line: null,
    // button: null,
} as const;
const _D_EDGE = [null,'e','w','s','n','es','en','ws','wn'] as const;

export namespace _DT
{
    export interface CAPTURE {
        cav: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
    }
    export type CHILD_NAME = keyof typeof _D_CLASS;
    export type CHILD_CLASS = typeof _D_CLASS[CHILD_NAME];
    export type CHILD_OBJECT = _AXIS;
    export type EDGE_NAME  = typeof _D_EDGE[number];
}

const GetClassByName = (type: _DT.CHILD_NAME): _DT.CHILD_CLASS =>
{
    const dClass = _D_CLASS[type];

    if (!dClass) {
        throw new Error(`[D_ERROR] ${type} 클래스가 등록되지 않았습니다.`);
    }

    return dClass;
}

export const _DC = {
    CLASS: _D_CLASS,
    EDGE: _D_EDGE,
    CHILD_ORDER: Object.keys(_D_CLASS) as _DT.CHILD_NAME[],
    GET_CLASS_BY_NAME: GetClassByName,
} as const;