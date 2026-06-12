import { _DPR, _VIEW, _CTRL, _REMO, _LOOP, _SPCE, _SETT, _METO, _MNGR } from '@/main'

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
            console.log('undo');
            _CTRL.CursorStyle('create');
            _METO.Undo();
            _MNGR.render.Draw();
            break;
        }
        case 'redo': {
            console.log('redo');
            _CTRL.CursorStyle('delete');
            _METO.Redo();
            _MNGR.render.Draw();
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