
import {_MAIN as _AXIS} from './axis'
import {_MAIN as _SQUARE} from './square'

export const ClassOrder = ['axis', 'square'] as const;
export const Class = {
    axis: _AXIS,
    square: _SQUARE,
} as const;

export const Edge = [null,'e','w','s','n','es','en','ws','wn'] as const;

