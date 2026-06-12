import { _METO , _STOR, _SETT } from '@/main'
import * as MementoType from '@/memento/memento.type'


/**
 * [List] 트랜잭션 목록
 * 1. 다이어그램: CRUD
 * 2. 스페이스 이동: 가능
 * 3. 탭 단위로: 탭 이동은 x
 */


export async function Load() {
    const tab = await _STOR.Post('tab-select', _SETT.openTabId);
    if(!tab || !tab.mementos) {return false;}

    _METO.InitLoad(tab.mementos);
}

export async function Exec(command: MementoType.Command, list: MementoType.work[]) {
    // console.log(command, list);
    _METO.Exec(command, list);
}

