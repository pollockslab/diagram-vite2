import { _STOR, _SETT, _TAB, _MNGR } from '@/main'
import * as IndexeddbType from '@/engines/indexeddb/indexeddb.type'
import{ Tab } from '@/tab/tab'
import * as TabType from '@/tab/tab.type'


export async function Load(): Promise<void> {
    await _STOR.Transaction(['tab'], 'readwrite', async (cmd) => {
        await LoadTX(cmd);
    });
}
export async function LoadTX(cmd: IndexeddbType.StoreCommand): Promise<void> {
    _TAB.Init();
    let select;
    // [Insert] 셋팅정보의 오픈 탭 ID 확인. 없을 경우 생성.
    if(!_SETT.open.tab.id) {
        select = await InsertTX(cmd);
    }
    else {
        select = await cmd.Get('tab', _SETT.open.tab.id);
        // [Validation] 조회정보 없을 시, 새로생성.
        if(!select) {
            select = await InsertTX(cmd);
        }
    }
    // [Update] Tab 모듈에 값 반영.
    _TAB.serialize = select;

    // [Update] Settings 모듈에 값 반영.
    _SETT.open.tab.id = _TAB.id;
}

export async function InsertTX(cmd: IndexeddbType.StoreCommand): Promise<TabType.Tab> {
    const origin = Tab.origin;
    origin.tab.id = crypto.randomUUID();
    await cmd.Add('tab', origin);
    return origin;
}

