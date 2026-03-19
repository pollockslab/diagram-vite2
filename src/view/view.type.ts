
import * as ViewBackgrond from './view.background'

export namespace Pattern {
    export type Class  = null | ViewBackgrond.Dot3 | ViewBackgrond.Rhombus | ViewBackgrond.Grid;
    export type String = null | 'dot3' | 'rhombus' | 'grid';
}