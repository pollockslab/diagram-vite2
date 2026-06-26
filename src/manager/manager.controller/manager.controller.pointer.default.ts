import { _CTRL, _VIEW, _LOOP, _MNGR, _EDIT, _SPCE } from '@/main'
import * as Diagrams from '@/diagrams/diagrams'
import * as SpaceType from '@/space/space.type'

const click = {
    timeStamp: 0
};
const edge = {
    down: undefined as undefined | SpaceType.Edge
}

export async function Down() {
    const down = _MNGR.controller.down;
    const downX = _VIEW.SpaceX(_CTRL.down.offsetX);
    const downY = _VIEW.SpaceY(_CTRL.down.offsetY);
        
    if(down.list.length > 0) {
        const diagram = down.list[down.list.length-1];
        diagram.zIndex = Date.now();
    
        if (diagram instanceof Diagrams.Class.Line) {
        }
        else if(diagram instanceof Diagrams.Class.Square) {
            down.dia.x = diagram.x;
            down.dia.y = diagram.y;

            // [Edge]
            edge.down = _SPCE.collision.Edge(diagram, downX, downY);
        }
        else if(diagram instanceof Diagrams.Class.Point) {
        }
    }
    down.view.x = _VIEW.x;
    down.view.y = _VIEW.y;

}

export async function Drag() {
    const down = _MNGR.controller.down;
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
            if(edge.down && edge.down.arrow) {

                console.log('늘리기1111')
                switch(edge.down.arrow) {
                    case 'e':
                        break;
                    case 'w':

                console.log('늘리기',rangeW)
                // 늘어나는데. 다이어그램   Snapshot 을 루프로 신청해야됨
                        diagram.x = down.dia.x + rangeW;
                        diagram.w += rangeW;
                        break;
                }
            }
            else {
                diagram.x = down.dia.x + rangeW;
                diagram.y = down.dia.y + rangeH;
            }
        }
        else if(diagram instanceof Diagrams.Class.Point) {
        }
    }
    _MNGR.render.Draw();
}

export async function Hover() {
    _LOOP.Command('collision', 'hover', _MNGR.loop.collision.Hover);
    _MNGR.render.Draw();
}

export async function Up() {
    const down = _MNGR.controller.down;
    const diagram = down.list[down.list.length-1];
    // [Validation] 업데이트 할 다이어그램 목록 확인.
    if(down.list.length > 0) {
        _MNGR.diagram.Update(diagram);
    }
    _MNGR.render.Draw();
}

export async function Click() {
    _MNGR.render.Draw();
}

export async function Dblclick() {
    const down = _MNGR.controller.down;
    
    if(down.list.length > 0) {
        const diagram = down.list[down.list.length-1];
        _EDIT.Open(diagram);
    }

}