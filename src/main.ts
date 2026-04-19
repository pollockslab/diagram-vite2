
import './main.css'
import { Dpr }          from '@/settings/settings'
import { Storage }      from '@/storage/storage'
import { Texteditor }   from '@/editor/texteditor'

import { View }         from '@/view/view'
import { Controller }   from '@/controller/controller'
import { Remocon }      from '@/remocon/remocon'
import { Transaction }  from '@/transaction/transaction'
import { Loop }         from '@/loop/loop'


const app = document.getElementById('app') as HTMLElement;

// [Tool] 싱글톤 방식. 전역변수에 기능별 객체를 저장. (예: _STOR 는 DB저장소 역할.)
export const _DPR  = new Dpr();
export const _STOR = new Storage();
export const _TEDI = new Texteditor();
export const _VIEW = new View({parentNode: app});
export const _CTRL = new Controller({parentNode: app});
export const _REMO = new Remocon({parentNode: app});
export const _LOOP = new Loop();
export const _TRAN = new Transaction();

async function Start(): Promise<void>  { 

    _LOOP.remocon = 'Pointer';
    const setting = await _STOR.Call('loadSetting', {});
    
    if (setting?.openTabID) {
        await _VIEW.LoadMap(setting.openTabID);
    }

    _TRAN.render.Draw();

    /// *** 트랜잭션.Init 을 만들자.
    // 오류상황에서 메멘토 쌓인것들 다 정리후 Init 을 해도 좋고
    // (Init 은 현재까지 저장된 상황을 다시 로딩.)

};
Start();


