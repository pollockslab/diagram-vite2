import './main.css'
import { Dpr }          from '@/dpr/dpr'
import { Snapshot }     from '@/snapshot/snapshot'
import { Storage }      from '@/storage/storage'
import { Space }        from '@/space/space'

import { View }         from '@/view/view'
import { Controller }   from '@/controller/controller'
import { Remocon }      from '@/remocon/remocon'
import { Settings }     from '@/settings/settings'
import { Tab }          from '@/tab/tab'


import { Loop }         from '@/loop/loop'
import { TabMemento }   from '@/tab_memento/tab_memento'
import { Tester }       from '@/tester/tester'

import { Manager }      from '@/manager/manager'

import { Editor }       from '@/editor/editor'


// [MainFrame] 웹다이어그램 모듈을 포함하는 공간.
const divMainFrame = document.createElement('div');
divMainFrame.id = 'div-main-frame';
document.body.appendChild(divMainFrame);


// [Tool] 싱글톤 모듈 방식. 기능별로 하나의 객체만 생성. (예: _STOR 는 DB저장소 역할.)
export const _DPR  = new Dpr();
export const _SNAP = new Snapshot();
export const _STOR = new Storage();
export const _SPCE = new Space();

// [Level] DIV 순서대로 생성.
export const _VIEW = new View({parentNode: divMainFrame});
export const _CTRL = new Controller({parentNode: divMainFrame});
export const _REMO = new Remocon({parentNode: divMainFrame});
export const _SETT = new Settings({parentNode: divMainFrame});
export const _EDIT = new Editor({parentNode: divMainFrame});
export const _TAB  = new Tab();


export const _LOOP = new Loop();
export const _METO = new TabMemento();
export const _TEST = new Tester();

export const _MNGR = new Manager();


// [Start] 프로그램 실행함수
_MNGR.main.Init();

