import { _DPR, _VIEW, _CTRL, _REMO, _LOOP, _TRAN, _SPCE, _MNGR } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'

const down = {
    list: [] as DiagramsType.Instance[],
    view: {
        x: 0,
        y: 0,
    },
};

export function Down() {
    switch(_REMO.selected) {
        case 'pointer': {
            _CTRL.CursorStyle('pointer');
            const spaceX = _VIEW.SpaceX(_CTRL.down.offsetX);
            const spaceY = _VIEW.SpaceY(_CTRL.down.offsetY);
            down.list = _SPCE.collision.Point(spaceX, spaceY);
            // list.length <= 0 이면 맵을 클릭했다고 판단함.
            down.view.x = _VIEW.x;
            down.view.y = _VIEW.y;
            break;
        }
        case 'square': {
            
            break;
        }
    }
}

export function Drag() {
    switch(_REMO.selected) {
        case 'pointer': {
            const rangeW = _VIEW.SpaceLine(_CTRL.move.offsetX - _CTRL.down.offsetX);
            const rangeH = _VIEW.SpaceLine(_CTRL.move.offsetY - _CTRL.down.offsetY);
            _VIEW.x = down.view.x - rangeW;
            _VIEW.y = down.view.y - rangeH;
            _MNGR.render.Draw();
            break;
        }
        case 'multiselect': {
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
            _LOOP.Command('collision', 'hover', _MNGR.loop.collision.Hover);
            break;
        }
        case 'square': {
            // 마우스 위치에 사각형 다이어그램 그림이나
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
        case 'square': {
            _TRAN.action.AddDiagram('Square', {x, y, w, h});
            _MNGR.render.Draw();
            break;
        }
    }
}

export function Click() {
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
            _TRAN.action.AddDiagram('Square', {x:upX, y:upY});
            _MNGR.render.Draw();
            break;
        }
    }
}