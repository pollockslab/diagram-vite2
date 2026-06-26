import { _MNGR, _METO, _REMO } from '@/main'

export class ControllerKeyboard {
    constructor() {
        window.addEventListener('keyup', (e) => {
            if(e.target !== document.body) {return;}
            console.log(e.code, e.ctrlKey);
            
            if(e.ctrlKey) {
                switch(e.code) {
                    case 'KeyY':
                        _METO.Redo();
                        _MNGR.render.Resize();
                        break;
                    case 'KeyZ':
                        _METO.Undo();
                        _MNGR.render.Resize();
                        break;
                }
            }
            else {
                switch(e.code) {
                    case 'KeyA': // 포인터 선택
                        _REMO.selected = 'pointer-default';
                        break;
                    case 'KeyE': // 사각형 편집
                        _REMO.selected = 'pointer-edit';
                        break;
                    case 'KeyD': // 사각형 생성
                        _REMO.selected = 'add-square';
                        break;
                    case 'KeyX': // 삭제버튼
                        _REMO.selected = 'pointer-delete';
                        break;
                }
            }
        })
    }
}