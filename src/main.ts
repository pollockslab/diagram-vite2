
import './main.css'
import { Dpr }          from '@/settings/settings'
import { Storage }      from '@/storage/storage'
import { Space }        from '@/space/space'

import { View }         from '@/view/view'
import { Controller }   from '@/controller/controller'
import { Remocon }      from '@/remocon/remocon'
import { Settings }     from '@/settings/settings'

import { Loop }         from '@/loop/loop'
import { Transaction }  from '@/transaction/transaction'
import { Tester }       from '@/tester/tester'

import { Manager }      from '@/manager/manager'


// [MainFrame] 웹다이어그램 모듈을 포함하는 공간.
const divMainFrame = document.createElement('div');
divMainFrame.id = 'div-main-frame';
document.body.appendChild(divMainFrame);


// [Tool] 싱글톤 모듈 방식. 기능별로 하나의 객체만 생성. (예: _STOR 는 DB저장소 역할.)
export const _DPR  = new Dpr();
export const _STOR = new Storage();
export const _SPCE = new Space();

// [Level] div 순서대로 생성.
export const _VIEW = new View({parentNode: divMainFrame});
export const _CTRL = new Controller({parentNode: divMainFrame});
export const _REMO = new Remocon({parentNode: divMainFrame});
export const _SETT = new Settings({parentNode: divMainFrame});

export const _LOOP = new Loop();
export const _TRAN = new Transaction();
export const _TEST = new Tester();

export const _MNGR = new Manager();


// [Start] 프로그램 실행함수
export async function Init() { 
    // _LOOP.remocon = 'Pointer';
    // const setting = await _STOR.Call('loadSetting', {});
    
    // if (setting?.openTabID) {
    //     await _VIEW.LoadMap(setting.openTabID);
    // }
    try {
        // 1. DB open
        await _STOR.Post('open', {});

        // 2. settings init
        await _MNGR.settings.Init();
        if(!_SETT.openTabId) {
            // idb 를 쓸 수 없으므로 서비스 이용불가.
            alert('[IDB ERROR] 서비스를 이용하실 수 없습니다.');
            return;
        }
        
        // 3. loadMap
        const isLoadMap = await _MNGR.space.Load(_SETT.openTabId);
        if(!isLoadMap) {
            // 맵 불러오기 실패. 서비스 이용불가.
            alert('[IDB ERROR] 서비스를 이용하실 수 없습니다.');
            return;
        }

        // 4. Transaction init
        

    }
    catch(error) {
        console.log('error', error);
    }


    
    _MNGR.render.Draw();
};
Init();


