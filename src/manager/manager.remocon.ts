import { _DPR, _VIEW, _CTRL, _REMO, _LOOP, _SPCE, _SETT } from '@/main'

export function Action(id: string) {
    // console.log(id);
    switch(id) {
        case 'square': {
            _CTRL.CursorStyle('create');
            break;
        }
        case 'setting': {
            _CTRL.CursorStyle('pointer');
            _SETT.popup.Open();
            break;
        }
        case 'imagedownload': {
            _CTRL.CursorStyle('pointer');
            break;
        }
        case 'undo': {
            _CTRL.CursorStyle('create');
            break;
        }
        case 'redo': {
            _CTRL.CursorStyle('delete');
            break;
        }
        default: {
            _CTRL.CursorStyle('pointer');
            break;
        }
    }
}

// 나누는게 나을지 생각해보자.
export function Passive() {

}

export function Active() {

}

export function Toggle() {

}