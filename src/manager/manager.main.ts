import { _MNGR, _STOR, _SETT, _TAB, _METO } from '@/main'
import { MultiKeyMap } from '@/engines/multikeymap/multikeymap'

/**
 * [Function] Init
 * @description '/main.ts' 에서 로드된 모듈을 가지고 작업환경을 초기화 하는 함수.  
 * 1. 셋팅값 불러오기
 * 2. 최근 탭 불러오기
 */
export async function Init() {
    try {
        await _STOR.Transaction(
            ['settings', 'tab', 'tab_memento', 'space_grid', 'diagram'],
            'readwrite', async (cmd) => {
            // [Load]  
            await _MNGR.settings.LoadTX(cmd);
            await _MNGR.tab.LoadTX(cmd);
            await _MNGR.tab_memento.LoadTX(cmd);
            await _MNGR.space.LoadTX(cmd);

            // [Grid] 화면에 보여줄 그리드 로딩
            await _MNGR.space_grid.LoadTX(cmd);
            
            // [Update]
            await cmd.Put('settings', _SETT.serialize);
            await cmd.Put('tab', _TAB.serialize);
            console.log(_TAB.serialize);
        });
    }
    catch(error) {
        console.error('error', error);
        // alert('[ERROR] 서비스를 이용하실 수 없습니다.');
        return;
    }
}
