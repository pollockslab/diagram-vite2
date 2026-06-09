import { _DPR, _VIEW, _CTRL, _REMO, _LOOP, _SPCE, _STOR, _MNGR, _SETT } from '@/main'
import * as Diagrams from '@/diagrams/diagrams'

// 이 함수를 호출하면 여러 정보를 거쳐서 셋팅한다라.
export async function Init() {
    try {
        let settings = await _STOR.Post('settings-select', 1);
        let tab;
        // [Settings] 초기 셋팅 생성
        if(!settings) {
            settings = _SETT.serialize;
            await _STOR.Post('settings-insert',  settings);
        }
        // [Tab] 조회
        if(settings.openTabId) { 
            tab = await _STOR.Post('tab-select', settings.openTabId);
        }
        // [Tab] 조회 실패. 생성
        if(!tab) {
           tab = await AddTab();
        }
        if(tab.id) {
            _SETT.openTabId = tab.id;
        }
        await _STOR.Post('settings-update',  _SETT.serialize);
    }
    catch(error) {
        // 오류상황. 메시지를 판단해서 새로고침을 권고할지 처리불가를 할지
        // 여기서 판단할지,
        // 오류메시지 모듈로 보내서 거기서 처리하게 하고, 로그도 거기서 보낼지
        // 아니면, 여기서 1차판단까지는 할지.
        // ** 여기서 오류가 나면 아무것도 할수가 없다. 
        console.log(error)
    }
}

export async function AddTab() {
    let ret;
    try {
        const tabId = crypto.randomUUID();
    
        // [Diagram] 초기 다이어그램 생성
        const axis = _MNGR.diagram.Cover({axis: {tabId: tabId}});
        if(!axis) {return false;}

        // [Save] 생성한 최상위 다이어그램 저장 
        await _STOR.Post('diagram-insert',  axis.serialize);
        
        let tab = {
            id: tabId,
            openDiagramId: axis.id,
            favorite: [],
            mementos: [],
        };
        await _STOR.Post('tab-insert',  tab); 
        ret = tab;
    }
    catch(error) {
        console.log(error);
        // 이 오류가 난 상황에서 뭘 어째야 할지.
        // 1. 서비스 불가를 알린다
        // 2. 일단 오류. 여기서 오류나면 
        //  2-1. idb 저장하려는데 용량이 부족한거
        //  2-2. idb 권한문제(권한을 따로 승인이 필요한가?)
        //  2-3. Post를 받는 Worker 프로세스가 고장난 경우.
    }
    return ret;
}

