import { Popup as EnginesPopup } from '@/engines/popup/popup'
import { _MNGR } from '@/main';

export class SettingsUI {

    
    popup       : EnginesPopup;

    constructor(args: {parentNode: HTMLElement}) {

         // [Popup]
        this.popup = new EnginesPopup({parentNode: args.parentNode});    
        this.popup.title.innerText = '환경설정';
        
        // this.popup.Open();

        this.AddInput(args.parentNode, '저장폴더 설정: ', 'text', '경로찾기', () => {
            _MNGR.storage.restoreDirectory();// 스토리지 갱신까지 됨
        });
    }

    Open() {
        this.popup.Open();
    }
    Close() {
        this.popup.Close();
    }

    AddInput(parentNode: HTMLElement, label: string, type: string, button: string, callback: () => void) {
        const divRow = document.createElement('div');
        divRow.classList.add('settings-row');

        const lblTitle = document.createElement('label');
        lblTitle.innerText = label;
        divRow.appendChild(lblTitle);

        const input = document.createElement('input');
        input.type = type;
        divRow.appendChild(input);

        const btnAction = document.createElement('button');
        btnAction.innerText = button;
        divRow.appendChild(btnAction);

        btnAction.addEventListener('click', callback);

        
        parentNode.appendChild(divRow);
    }
}