import { _DPR, _VIEW, _CTRL, _REMO, _LOOP, _METO , _SPCE, _STOR, _MNGR, _SETT } from '@/main'

/**
 * [List] 트랜잭션 목록
 * 1. 다이어그램: CRUD
 * 2. 스페이스 이동: 가능
 * 3. 탭 단위로: 탭 이동은 x
 */


export async function Load(tabId: string) {
    const tab = await _STOR.Post('tab-select', tabId);
    if(!tab || !tab.mementos) {return false;}

    console.log('여기', tab);

    _METO.InitLoad(tab.mementos);
}

export async function Exec(commandID:string, old: any, now: any) {
    console.log(commandID, old, now);

    // _METO.Exec(commandID, old, now);
    // 매번 디비에 저장할꺼면 뭣하러 모듈을 만들어


    

}

