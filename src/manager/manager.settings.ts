import { _STOR, _SETT } from '@/main'
import * as IndexeddbType from '@/engines/indexeddb/indexeddb.type'

 
export async function Load(): Promise<void> {
    await _STOR.Transaction(['settings'], 'readwrite', async (cmd) => {
        await LoadTX(cmd);
    });
}
export async function LoadTX(cmd: IndexeddbType.StoreCommand): Promise<void> {
    _SETT.Init();
    // [Rule] 셋팅정보는, IDB.settings(objectStore)의 키가 `1`인 행만 사용.
    _SETT.id = _SETT.loadKey;

    const settings = await cmd.Get('settings', _SETT.id);

    // [Validation] 셋팅정보 조회성공. 정보 저장후 종료.
    if (settings) {
        _SETT.serialize = settings;
        return;
    }

    // [Insert] 생에 처음 접속시(키가 `1`인 행 없을 경우), 셋팅정보 생성하기.
    await cmd.Add('settings', _SETT.serialize);
}


