import { _DPR, _VIEW, _CTRL, _REMO, _LOOP, _SPCE, _STOR, _MNGR, _SETT } from '@/main'
import * as SettingsType from '@/settings/settings.type'

export async function Init(): Promise<boolean> {
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
           tab = await InsertTab();
           if(!tab) {return false;}
        }
        // [Settings] 탭정보 입력.
        _SETT.tab = tab;

        // [Settings] 최신정보 DB 업데이트
        await _STOR.Post('settings-update',  _SETT.serialize);
        return true;
    }
    catch(error) {
        console.error(error);
        return false;
    }
}

export async function InsertTab(): Promise<undefined | SettingsType.Tab> {
    try {
        const tabId = crypto.randomUUID();
    
        // [Diagram] 초기 다이어그램 생성
        const axis = _MNGR.diagram.Cover({axis: {tabId: tabId}});
        if(!axis) {return;}

        // [Save] 생성한 최상위 다이어그램 저장 
        await _STOR.Post('diagram-insert',  axis.serialize);
        
        let tab: SettingsType.Tab = {
            id: tabId,
            openDiagramId: axis.id,
            favorite: [],
            mementos: {
                history: [],
                nowOrder : -1
            },
        };
        await _STOR.Post('tab-insert',  tab); 
        return tab;
    }
    catch(error) {
        console.error(error);
    }
}

