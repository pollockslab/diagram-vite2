import { Popup as EnginesPopup } from '@/engines/popup/popup'
import { _MNGR, _STOR } from '@/main';
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

    // [Info] 기본정보
    private info = {
        id: 1,
        openTabId: null as null | string,
    }

    constructor(args: {parentNode: HTMLElement}) {
        this.parentNode = args.parentNode;
        this.popup = new EnginesPopup({parentNode: args.parentNode});    
        this.popup.title.innerText = '환경설정';
        
        this.ui = new SettingsUI({parentNode: this.popup.panel})
        // this.popup.Open();
    }

    get serialize() {
        return this.info;
    }
    get id() {
        return this.info.id;
    }
    get openTabId() {
        return this.info.openTabId;
    }
    set openTabId(data) {
        this.info.openTabId = data;
    }
}