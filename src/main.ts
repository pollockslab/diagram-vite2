
import './main.css'
import { Storage }      from '@storage/storage'
import { Texteditor }   from '@editor/texteditor'
import { View }         from '@view/view'
import { Controller }   from '@controller/controller'
import { Remocon }      from '@remocon/remocon'
import { Transaction }  from '@transaction/transaction'
import { Loop }         from '@loop/loop'


const app = document.querySelector<HTMLDivElement>('#app') as HTMLDivElement;

export const _DPR  = {
    value: Math.round(window.devicePixelRatio) || 1,
    Update(): void {
        this.value = Math.round(window.devicePixelRatio) || 1;
    },
};

// [Tool] 기능별로 분리함. (예: _STOR -> DB저장소.)
export const _STOR = new Storage();
export const _TEDI = new Texteditor();
export const _VIEW = new View({parentNode: app});
export const _CTRL = new Controller({parentNode: app});
export const _REMO = new Remocon({parentNode: app});
export const _LOOP = new Loop();
export const _TRAN = new Transaction();



const Init = async (): Promise<void> => 
{ 
    _LOOP.remocon = 'Pointer';
    const setting = await _STOR.Call('loadSetting', {});
    
    if (setting?.openTabID) {
        await _VIEW.LoadMap(setting.openTabID);
    }

    _TRAN.render.Draw();
};
Init();
