import { _MNGR } from '@/main';
import { SettingsUI } from './settings.ui';
import * as SettingsType from './settings.type'
import './settings.css'

// [Rule] 셋팅정보는, IDB.settings(objectStore)의 키가 `1`인 행만 사용.
const SETTINGS_LOAD_KEY = '1';
export class Settings {
    
    parentNode  : HTMLElement;
    ui          : SettingsUI;
    
    id: SettingsType.ID = null;
    open = {
        tab: {
            id: null as SettingsType.ID,
        },
    };

    constructor(args: {parentNode: HTMLElement}) {
        this.parentNode = args.parentNode;
        this.ui = new SettingsUI({parentNode: this.parentNode});
    }

    static get origin(): SettingsType.Settings {
        return {
            settings: {
                id: null,
            },
            open: {
                tab: {
                    id: null,
                },
            },
        }
    }

    get serialize(): SettingsType.Settings {
        return {
            settings: {
                id: this.id,
            },
            open: {
                tab: {
                    id: this.open.tab.id,
                },
            },
        };
    }
    set serialize(data: SettingsType.Settings) {
        this.id = data.settings.id;
        this.open.tab.id = data.open.tab.id;
    }
    get loadKey() {
        return SETTINGS_LOAD_KEY;
    }

    Init() {
        this.serialize = Settings.origin;
    }
}