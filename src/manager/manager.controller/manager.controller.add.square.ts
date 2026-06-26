import { _VIEW, _CTRL, _LOOP, _MNGR } from '@/main'
import * as Diagrams from '@/diagrams/diagrams'

export async function Down() {
}

export async function Drag() {
    _LOOP.Command('render', 'drag-square', _MNGR.loop.render.Drag);
}

export async function Hover() {

}

export async function Up() {
    const downX = _VIEW.SpaceX(_CTRL.down.offsetX);
    const downY = _VIEW.SpaceY(_CTRL.down.offsetY);
    const upX   = _VIEW.SpaceX(_CTRL.up.offsetX);
    const upY   = _VIEW.SpaceY(_CTRL.up.offsetY);

    const x = Math.min(downX, upX);
    const y = Math.min(downY, upY);
    const w = Math.abs(upX - downX);
    const h = Math.abs(upY - downY);


    // const instance = Diagrams.Class.Square.create({
    //     square: {x, y, w, h}
    // });
    const instance = Diagrams.Class.Memo.create({
        square: {x, y, w, h},
        memo: {backgroundColor: 'green', text: '그린'},
    });
    _MNGR.diagram.Insert(instance.serialize);
    _MNGR.render.Draw();
}

export async function Click() {
    const upX   = _VIEW.SpaceX(_CTRL.up.offsetX);
    const upY   = _VIEW.SpaceY(_CTRL.up.offsetY);

    // const instance = new Diagrams.Class.Square({
    //     square: {x: upX, y: upY}
    // });
    const instance = Diagrams.Class.Memo.create({
        square: {x: upX, y: upY},
        memo: {backgroundColor: 'green', text: '그린'},
    });

    _MNGR.diagram.Insert(instance.serialize);
    _MNGR.render.Draw();
}