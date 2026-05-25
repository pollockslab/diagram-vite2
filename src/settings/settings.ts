import { Popup as EnginesPopup } from '@/engines/popup/popup'
import { _MNGR } from '@/main';
import { SettingsUI } from './settings.ui';
import './settings.css'

export class Dpr {
    value: number = 1;
    constructor() {
        this.Update();
    }
    Update(): void {
        this.value = Math.round(window.devicePixelRatio) || 1;
    }
}

export class Settings {
    parentNode: HTMLElement;
    popup: EnginesPopup;
    ui: SettingsUI;

    constructor(args: {parentNode: HTMLElement}) {
        this.parentNode = args.parentNode;
        this.popup = new EnginesPopup({parentNode: args.parentNode});    
        this.popup.title.innerText = '환경설정';
        
        this.ui = new SettingsUI({parentNode: this.popup.panel})
        this.popup.Open();
    }
}