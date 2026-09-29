import { _STOR, _TAB, _METO } from '@/main'
import * as IndexeddbType from '@/engines/indexeddb/indexeddb.type'
import{ TabMemento } from '@/tab_memento/tab_memento'


export async function Load(): Promise<void> {
    await _STOR.Transaction(['tab_memento'], 'readwrite', async (cmd) => {
        await LoadTX(cmd);
    });
}
export async function LoadTX(cmd: IndexeddbType.StoreCommand): Promise<void> {
    _METO.Init();
    // [Validation] 탭 ID 확인. 없을 경우 종료.
    if(!_TAB.id) { return; }
    let select = await cmd.Get('tab_memento', _TAB.id);
    // [Insert] 조회된 정보 없을 경우. 새로 생성.
    if(!select) {
        await InsertTX(cmd, _TAB.id);
        select = await cmd.Get('tab_memento', _TAB.id);
    }
    // [Sync] 모듈에 값 반영.
    _METO.serialize = select;

    // [Trim] 저장된 히스토리가 최대 크기를 초과했다면, 정리 후 업데이트.
    if(_METO.TrimHistory()) {
        await cmd.Put('tab_memento', _METO.serialize);
    }
}

export async function InsertTX(cmd: IndexeddbType.StoreCommand, id: string): Promise<void> {
    const origin = TabMemento.origin;
    origin.tab_memento.id = id;
    await cmd.Add('tab_memento', origin);
}