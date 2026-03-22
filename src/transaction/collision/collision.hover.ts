import { _LOOP, _VIEW, _TRAN, _CTRL } from '../../main'


export function Hover() {

    _LOOP.Command('collision', 'hover', () => {

        const spaceX = _VIEW.SpaceX(_CTRL.hover.offsetX);
        const spaceY = _VIEW.SpaceY(_CTRL.hover.offsetY);

        const now = _TRAN.collision.point.FindFront(_VIEW, spaceX, spaceY);
        const old = _CTRL.hover.target;
        if(old !== now) {
            _CTRL.hover.target = now;
        }
        const oldEdge = _CTRL.hover.edge;
        if(now) {
            _CTRL.hover.edge = _TRAN.collision.edge.Check(now, spaceX, spaceY);
        }
        else {
            _CTRL.hover.edge = null; 
        }
        const nowEdge = _CTRL.hover.edge;
        if(oldEdge !== nowEdge) {
            
            if(!nowEdge) { document.body.style.cursor = 'default'; }
            else         { document.body.style.cursor = `${nowEdge}-resize`; }
        }
    });
}