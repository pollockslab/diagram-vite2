import { Popup as EnginesPopup } from '@/engines/popup/popup'
import { _MNGR, _STOR } from '@/main';
import { SettingsUI } from './settings.ui';
import * as SettingsType from './settings.type'
import './settings.css'



export class Settings {
    parentNode: HTMLElement;
    popup: EnginesPopup;
    ui: SettingsUI;

    // [Info] Settings 기본정보
    id = 1;
    tab: SettingsType.Tab = {
        id           : null, // tabId
        openDiagramId: null,
        favorite: [],
        mementos: {
            history: [],
            nowOrder : -1,
        },
    };

    constructor(args: {parentNode: HTMLElement}) {
        this.parentNode = args.parentNode;
        this.popup = new EnginesPopup({parentNode: args.parentNode});    
        this.popup.title.innerText = '환경설정';
        
        this.ui = new SettingsUI({parentNode: this.popup.panel});
        // this.popup.Open();
    }

    get serialize(): SettingsType.Settings {
        return {
            id: this.id,
            openTabId: this.tab.id,
        };
    }
    get openTabId() {
        return this.tab.id;
    }
    set openTabId(data) {
        this.tab.id = data;
    }
}

export class Dpr {
    value: number = 1;
    constructor() {
        this.Update();
    }
    Update(): void {
        this.value = Math.round(window.devicePixelRatio) || 1;
    }
}