import { _DPR, _VIEW, _CTRL, _REMO, _LOOP, _SPCE, _MNGR } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'
import * as Diagrams from '@/diagrams/diagrams'

import * as ManagerType from '@/manager/manager.type'

import * as _POINTER from './manager.controller.pointer'
import * as _SQUARE from './manager.controller.square'
import * as _MULTISELECT from './manager.controller.multiselect'
import * as _POINTERDELETE from './manager.controller.pointerdelete'

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
    pointer: _POINTER,
    square: _SQUARE,
    multiselect: _MULTISELECT,
    pointerdelete: _POINTERDELETE,
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
    console.log('감자')
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