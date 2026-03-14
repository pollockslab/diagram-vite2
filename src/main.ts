
import './main.css'
import {_MAIN as _PAGE_STORAGE} from './storage/storage'
import {_MAIN as _PAGE_EDITOR_TEXT} from './editor/texteditor'
import { View } from './view/view'
import { Controller } from './controller/controller'
import { Remocon } from './remocon/remocon'
import {_MAIN as _PAGE_TRANSACTION} from './transaction/transaction'
import {_MAIN as _PAGE_LOOP} from './loop/loop'


interface PageConstructor<T> {
    new (options: { parentNode: HTMLDivElement }): T;
}

const divApp = document.querySelector<HTMLDivElement>('#app') as HTMLDivElement;

export const _DPR  = {
    value: Math.round(window.devicePixelRatio) || 1,
    Update(): void {
        this.value = Math.round(window.devicePixelRatio) || 1;
    },
};
export const _STOR = new _PAGE_STORAGE();
export const _TEDI = LoadPage(_PAGE_EDITOR_TEXT, "tedi");
export const _VIEW = LoadPage(View, "view");
export const _CTRL = new Controller({parentNode: divApp});
export const _REMO = new Remocon({parentNode: divApp});
export const _TRAN = new _PAGE_TRANSACTION();
export const _LOOP = new _PAGE_LOOP();




const Init = async (): Promise<void> => 
{ 

    const setting = await _STOR.Call('loadSetting', {});
    
    if (setting?.openTabID) {
        await _VIEW.LoadMap(setting.openTabID);
    }
    _LOOP.isDraw = true;
};
Init();


/**
 * 페이지 객체 생성 (Generic 적용)
 * @param pageClass 생성할 클래스
 * @param id DOM에 부여할 ID
 */
function LoadPage<T>(pageClass: PageConstructor<T>, id: string): T {
    const div = document.createElement('div');
    div.id = id;
    
    // divApp이 null일 경우를 대비한 안전장치
    divApp?.appendChild(div);
    
    // 클래스 인스턴스 생성 및 반환
    const pageObject = new pageClass({ parentNode: div });
    
    return pageObject;
}