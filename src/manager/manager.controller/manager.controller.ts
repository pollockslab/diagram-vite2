import { _DPR, _VIEW, _CTRL, _REMO, _LOOP, _SPCE, _MNGR } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'
import * as ManagerType from '@/manager/manager.type'

import * as _POINTER_DEFAULT from './manager.controller.pointer.default'
import * as _POINTER_MULTISELECT from './manager.controller.pointer.multiselect'
import * as _POINTER_DELETE from './manager.controller.pointer.delete'
import * as _POINTER_SPACE from './manager.controller.pointer.space'
import * as _POINTER_EDIT from './manager.controller.pointer.edit'

import * as _ADD_SQUARE from './manager.controller.add.square'

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

// [Mapping] 리모콘 버튼마다 호출할 페이지 매핑.
const RemoconButtons: Record<string, ManagerType.ControllerAction> = {
    // [Pointer]
    'pointer-default': _POINTER_DEFAULT,
    'pointer-multiselect': _POINTER_MULTISELECT,
    'pointer-delete': _POINTER_DELETE,
    'pointer-space': _POINTER_SPACE,
    'pointer-edit': _POINTER_EDIT,

    // [Add Diagram]
    'add-square': _ADD_SQUARE,
}

export async function Down() {
    _CTRL.CursorStyle(_REMO.selected);

    down.list = [];
    const spaceX = _VIEW.SpaceX(_CTRL.down.offsetX);
    const spaceY = _VIEW.SpaceY(_CTRL.down.offsetY);
    down.list = _SPCE.collision.Point(spaceX, spaceY);

    await RemoconButtons[_REMO.selected]?.Down?.();
}

export async function Drag() {
    await RemoconButtons[_REMO.selected]?.Drag?.();    
}

export async function Hover() {
    await RemoconButtons[_REMO.selected]?.Hover?.();
}

export async function Up() {
    await RemoconButtons[_REMO.selected]?.Up?.();
}

export async function Click() {
    await RemoconButtons[_REMO.selected]?.Click?.();
}

export async function Dblclick() {
    await RemoconButtons[_REMO.selected]?.Dblclick?.();
}