
import './main.css'
import {_MAIN as _PAGE_STORAGE} from './storage/storage'
import {_MAIN as _PAGE_EDITOR_TEXT} from './editor/texteditor'
import {_MAIN as _PAGE_VIEW} from './view/view'
import {_MAIN as _PAGE_CONTROLLER} from './view/controller'
import {_MAIN as _PAGE_ATLAS} from './view/atlas'
import {_MAIN as _PAGE_REMOCON} from './remocon/remocon'


interface PageConstructor<T> {
    new (options: { parentNode: HTMLDivElement }): T;
}

const divApp = document.querySelector<HTMLDivElement>('#app') as HTMLDivElement;

export const _STOR = new _PAGE_STORAGE();
export const _TEDI = LoadPage(_PAGE_EDITOR_TEXT, "tedi");
export const _ATLA = new _PAGE_ATLAS();
export const _VIEW = LoadPage(_PAGE_VIEW, "view");
export const _CTRL = LoadPage(_PAGE_CONTROLLER, "controller");
export const _REMO = LoadPage(_PAGE_REMOCON, "remocon");


const btnRemoPos = document.createElement("div");
btnRemoPos.id = 'remocon_reset_pos';
divApp?.appendChild(btnRemoPos);
btnRemoPos.onclick = () =>
{
    _REMO.parentNode.style.left = '10px';
    _REMO.parentNode.style.top = '30px';
};


const Init = async (): Promise<void> => 
{ 

    // const setting = await _STOR.Call('loadSetting', {});
    // console.log(setting)
    // if (setting?.openTabID) {
    //     await _VIEW.LoadDiagrams(setting.openTabID);
    // }
    await _VIEW.LoadMap('test1');
    
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