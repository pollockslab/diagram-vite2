
import './main.css'
import { Storage }      from '@storage/storage'
import { Texteditor }   from '@editor/texteditor'
import { View }         from '@view/view'
import { Controller }   from '@controller/controller'
import { Remocon }      from '@remocon/remocon'
import { Transaction }  from '@transaction/transaction'
import { Loop }         from '@loop/loop'
import { Engines }      from '@engines/engines'


class DPR {
    value: number = 1;
    constructor() {
        this.Update();
    }
    Update(): void {
        this.value = Math.round(window.devicePixelRatio) || 1;
    }
}
const app = document.querySelector<HTMLDivElement>('#app') as HTMLDivElement;


// [Tool] 싱글톤 방식. 전역변수에 기능별 객체를 저장. (예: _STOR 는 DB저장소 역할.)
export const _TAB  = new Engines.TabSingle({parentElement: app});
export const _DPR  = new DPR();
export const _STOR = new Storage();
export const _TEDI = new Texteditor();
export const _VIEW = new View({parentNode: _TAB.panel});
export const _CTRL = new Controller({parentNode: _TAB.panel});
export const _REMO = new Remocon({parentNode: _TAB.panel});
export const _LOOP = new Loop();
export const _TRAN = new Transaction();
_TAB.Add('감자', true);
_TAB.Add('고구마');
_TAB.Add('민물달팽이 뱀장어');
_TAB.Add('민물달팽이 뱀장어');
_TAB.Add('민물달팽이 뱀장어');
_TAB.Add('민물달팽이 뱀장어');
_TAB.Add(' 뱀장어123123123123123');
_TAB.Select((id: string) => {
    console.log('여기', id);
    return true;
});
_TAB.Close((id: string) => {
    console.log('닫기', id);
    return true;
});

async function Start(): Promise<void>  { 
    _LOOP.remocon = 'Pointer';
    const setting = await _STOR.Call('loadSetting', {});
    
    if (setting?.openTabID) {
        await _VIEW.LoadMap(setting.openTabID);
    }

    _TRAN.render.Draw();

};
Start();
