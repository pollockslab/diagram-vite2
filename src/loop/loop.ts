import { type _LT } from './loop.type'
import { _VIEW, _REMO } from '../main';
import * as diagramsType from '../diagrams/diagrams.type'
import * as diagramsCollisionPoint from '../diagrams/diagrams.collision.point'
import * as diagramsCollisionEdge from '../diagrams/diagrams.collision.edge'

export class Loop {

    private tasks = this._POINTER;
    isDraw = false;
    isResize = false;
    isHover: null | {offsetX: number, offsetY: number} = null; 

    constructor() {
        this.Loop();
    }

    Loop = () => {
        this.tasks();
        requestAnimationFrame(this.Loop);
    }

    _POINTER() {
        if(this.isResize) {
            _VIEW.Resize();
            this.isResize = false;
        }

        if(this.isHover) {
            const spaceX = _VIEW.SpaceX(this.isHover.offsetX);
            const spaceY = _VIEW.SpaceY(this.isHover.offsetY);
            const collisionTarget = diagramsCollisionPoint.GetChildFirst(_VIEW, spaceX, spaceY);
            
            const count = _VIEW.effect.GetLength('hover');
            _VIEW.effect.Init('hover');
            if(collisionTarget) {
                const edge = diagramsCollisionEdge.Check(collisionTarget, spaceX, spaceY);   
                _VIEW.effect.Insert('hover', [collisionTarget]);
                this.isDraw = true;
            }
            else if(count !== 0){
                this.isDraw = true;
            }
            this.isHover = null;
    
        }

        if(this.isDraw) {
            _VIEW.Draw();
            this.isDraw = false;
        }
    }

    _MULTI_SELECT() {

    }
}