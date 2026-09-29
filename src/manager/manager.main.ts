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
            // 콜리전 체크를 해야되나? 여튼 현재 화면의 좌표
            // 상, 하, 좌, 우 좌표 구해서 1000x1000 그리드 좌표 구해봐
            // 그리고 목록으로 만들고 그리드 IDB 조회해오기
            // 조회결과를 space.gridList 에도 넣고, 
            // 전체 다이어그램 객체 space.diagrams 에도 넣고
            // 넣은이후 루프에 draw 예약하기
            // View 에서는 space.diagrams 들 다 그린다.
            // 화면에 보이는것만 그리도록 하는게 맞나. 
            // chain 만은 예외로 그리는게 맞을수도(매번 기울기 계산하는거보다 그리는게)


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
