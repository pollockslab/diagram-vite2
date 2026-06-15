import { _MNGR, _METO, _REMO } from '@/main'

export class ControllerKeyboard {
    constructor() {
        window.addEventListener('keyup', (e) => {

            // console.log(e.key, e.ctrlKey);
            
            if(e.ctrlKey) {
                switch(e.key) {
                    case 'y':
                        _METO.Redo();
                        _MNGR.render.Resize();
                        break;
                    case 'z':
                        _METO.Undo();
                        _MNGR.render.Resize();
                        break;
                }
            }
            else {
                switch(e.key) {
                    case 'a': // 포인터 선택
                        _REMO.selected = 'pointer-default';
                        break;
                    case 'e': // 사각형 편집
                        _REMO.selected = 'pointer-edit';
                        break;
                    case 'd': // 사각형 생성
                        _REMO.selected = 'add-square';
                        break;
                    case 'x': // 삭제버튼
                        _REMO.selected = 'pointer-delete';
                        break;
                }
            }
        })
    }
}