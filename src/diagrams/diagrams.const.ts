
import { Axis } from './axis'
import { Square } from './square'

export const ClassOrder = ['axis', 'square'] as const;
export const Class = {
    axis: Axis,
    square: Square,
} as const;

export const Edge = [null,'e','w','s','n','es','en','ws','wn'] as const;

