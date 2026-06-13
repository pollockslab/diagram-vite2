import { _DPR, _VIEW, _CTRL, _REMO, _LOOP, _SPCE, _MNGR } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'
import * as Diagrams from '@/diagrams/diagrams'

export const down = {
    list: [] as DiagramsType.Instance[],
    view: {
        x: 0,
        y: 0,
    },
    dia: {
        x: 0, 
        y: 0.
    }
    
};

export function Down() {
    
    _CTRL.CursorStyle('pointer');

    down.list = [];
    const spaceX = _VIEW.SpaceX(_CTRL.down.offsetX);
    const spaceY = _VIEW.SpaceY(_CTRL.down.offsetY);
    down.list = _SPCE.collision.Point(spaceX, spaceY);

    
    switch(_REMO.selected) {
        case 'pointer': {
            if(down.list.length > 0) {
                const diagram = down.list[down.list.length-1];
                diagram.zIndex = Date.now();
               
                if (diagram instanceof Diagrams.Class.Line) {
                }
                else if(diagram instanceof Diagrams.Class.Square) {
                    down.dia.x = diagram.x;
                    down.dia.y = diagram.y;
                }
                else if(diagram instanceof Diagrams.Class.Point) {
                }
            }
            down.view.x = _VIEW.x;
            down.view.y = _VIEW.y;
            break;
        }
        case 'pointerdelete': {
            if(down.list.length <= 0) {break;}

            break;
        }
    }
}

export function Drag() {
    
    switch(_REMO.selected) {
        case 'pointer': {
            const rangeW = _VIEW.SpaceLine(_CTRL.move.offsetX - _CTRL.down.offsetX);
            const rangeH = _VIEW.SpaceLine(_CTRL.move.offsetY - _CTRL.down.offsetY);
               

            if(down.list.length <= 0) {
                _VIEW.x = down.view.x - rangeW;
                _VIEW.y = down.view.y - rangeH;
            }
            else {
                const diagram = down.list[down.list.length-1];
                if (diagram instanceof Diagrams.Class.Line) {
                }
                else if(diagram instanceof Diagrams.Class.Square) {
                    diagram.x = down.dia.x + rangeW;
                    diagram.y = down.dia.y + rangeH;
                }
                else if(diagram instanceof Diagrams.Class.Point) {
                }
            }
            _MNGR.render.Draw();
            // diagram 을 끌고 있을 경우 _MNGR.diagram.Update() 하지말고, 좌표만 저장해주기
            break;
        }
        case 'multiselect': {
            _LOOP.Command('render', 'drag-square', _MNGR.loop.render.Drag);
            break;
        }
        case 'space':
            break;
        case 'delete':
            break;
        case 'square':
            _LOOP.Command('render', 'drag-square', _MNGR.loop.render.Drag);

            break;
    }

    // if(target.edge === null) {
    //     // [Move] 다이어그램 이동
    //     target.diagram.x = target.x + range.w;
    //     target.diagram.y = target.y + range.h;
    //     _TRAN.render.Draw();
    // }
    // else {
    //     // 다이어그램 리사이즈
    //     // this.ResizeDiagram(xRange, yRange);
    // }
}

export function Hover() {
    // this.hover.offsetX = offsetX;
    // this.hover.offsetY = offsetY;
    // _TRAN.collision.hover.Hover();

   


    switch(_REMO.selected) {
        case 'pointer': {
            // 커서 다이어그램 콜리전체크. 모서리(크기변경모양), 몸통(보더)
            // _LOOP.Command('collision', 'hover', _MNGR.loop.collision.Hover);
            // [Collision] 
            // 이걸 effect 만 새로 그리게? 불가능하지
            _LOOP.Command('collision', 'hover', _MNGR.loop.collision.Hover);
            _MNGR.render.Draw();
            break;
        }
        case 'square': {
            // 마우스 위치에 사각형 다이어그램 그림이나
            break;
        }
        case 'multiselect': {
            _MNGR.render.Draw();
            break;
        }
    }


}

export function Up() {
    const downX = _VIEW.SpaceX(_CTRL.down.offsetX);
    const downY = _VIEW.SpaceY(_CTRL.down.offsetY);
    const upX   = _VIEW.SpaceX(_CTRL.up.offsetX);
    const upY   = _VIEW.SpaceY(_CTRL.up.offsetY);

    const x = Math.min(downX, upX);
    const y = Math.min(downY, upY);
    const w = Math.abs(upX - downX);
    const h = Math.abs(upY - downY);
    
    switch(_REMO.selected) {
        case 'pointer':
            const diagram = down.list[down.list.length-1];
            if(down.list.length > 0) {
                _MNGR.diagram.Update(diagram);
            }
            _MNGR.render.Draw();
            break;
        case 'square': {
            const instance = new Diagrams.Class.Square({
                square: {x, y, w, h}
            });
            _MNGR.diagram.Insert(instance.serialize);
            _MNGR.render.Draw();
            break;
        }
    }
}

export async function Click() {
    // const downX = _VIEW.SpaceX(_CTRL.down.offsetX);
    // const downY = _VIEW.SpaceY(_CTRL.down.offsetY);
    const upX   = _VIEW.SpaceX(_CTRL.up.offsetX);
    const upY   = _VIEW.SpaceY(_CTRL.up.offsetY);
    
    // const x = Math.min(downX, upX);
    // const y = Math.min(downY, upX);
    // const w = Math.abs(upX - downX);
    // const h = Math.abs(upY - downY);



    
    switch(_REMO.selected) {
        case 'square': {
            const instance = new Diagrams.Class.Square({
                square: {x: upX, y: upY}
            });
            _MNGR.diagram.Insert(instance.serialize);
            _MNGR.render.Draw();
            break;
        }
        case 'pointerdelete': {
            if(down.list.length > 0) {
                const diagram = down.list[down.list.length-1];
                console.log(diagram)
                await _MNGR.diagram.Delete(diagram);
                _MNGR.render.Draw();
                
            }
            break;
        }
    }
}