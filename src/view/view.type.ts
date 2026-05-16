
import * as ViewBackgrond from './view.background'

export namespace Pattern {
    export type Class  = null | ViewBackgrond.Dot3 | ViewBackgrond.Rhombus | ViewBackgrond.Grid;
    export type String = null | 'dot3' | 'rhombus' | 'grid';
}


export const ChildrenOrder = ['Axis', 'Line', 'Square', 'Point', 'Button'] as const;

export interface EffectSquare {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
}