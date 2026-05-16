
import './main.css'
import { Dpr }          from '@/settings/settings'
import { Storage }      from '@/storage/storage'
import { Texteditor }   from '@/editor/texteditor'

import { Space }        from '@/space/space'
import { View }         from '@/view/view'
import { Controller }   from '@/controller/controller'
import { Remocon }      from '@/remocon/remocon'

import { Loop }         from '@/loop/loop'
import { Transaction }  from '@/transaction/transaction'
import { Tester }       from '@/tester/tester'

import { Manager }      from '@/manager/manager'

// [Root] app: index.html 에서 작성한 엘리먼트.(웹다이어그램 최상위 엘리먼트)
const app = document.getElementById('app') as HTMLElement;

// [Tool] 싱글톤 방식. 전역변수에 기능별 객체를 저장. (예: _STOR 는 DB저장소 역할.)
export const _DPR  = new Dpr();
export const _STOR = new Storage();
export const _TEDI = new Texteditor();

export const _SPCE = new Space();
export const _VIEW = new View({parentNode: app});
export const _CTRL = new Controller({parentNode: app});
export const _REMO = new Remocon({parentNode: app});

export const _LOOP = new Loop();
export const _TRAN = new Transaction();
export const _TEST = new Tester();

export const _MNGR = new Manager();


// [Start] 프로그램 실행함수
(async () => { 
    _LOOP.remocon = 'Pointer';
    const setting = await _STOR.Call('loadSetting', {});
    
    if (setting?.openTabID) {
        await _VIEW.LoadMap(setting.openTabID);
    }

    _MNGR.render.Draw();

    /// *** 트랜잭션.Init 을 만들자.
    // 오류상황에서 메멘토 쌓인것들 다 정리후 Init 을 해도 좋고
    // (Init 은 현재까지 저장된 상황을 다시 로딩.)

    // console.log('임시로 테스트');
    // _TRAN.action.AddDiagram('Square', {x:50, y:30});
    // _TRAN.action.AddDiagram('Line', {x1:2000, y1:-1550, x2: 1000, y2: 700});
    // _TRAN.action.AddDiagram('Point', {x:-50, y:-50});


})();


