import { _DPR, _VIEW, _CTRL, _REMO, _LOOP, _SPCE, _STOR, _MNGR, _SETT } from '@/main'


export async function Load() {
    
    const tabId = _SETT.openTabId;

    try {
        // [Select] 탭 조회.
        const tab = await _STOR.Post('tab-select', tabId);
        if(!tab) {return false;}

        // [Select] 오픈한 다이어그램이 실제한지 조회.
        let openDiagram;
        if(tab.openDiagramId) {
            openDiagram = await _STOR.Post('diagram-select', tab.openDiagramId);
        }
        
        // [Validation] DB 조회 건이 없을 경우.
        if(!openDiagram) {
            // [New] 초기 다이어그램 생성.
            openDiagram = _MNGR.diagram.Cover({axis: {tabId: tabId}})?.serialize;
            if(!openDiagram) {return false;}

            // [Save] 생성한 최상위 다이어그램 저장 .
            await _STOR.Post('diagram-insert',  openDiagram);

            // [Update] 탭에 생성한 다이어그램 업데이트
            tab.openDiagramId = openDiagram.axis.id;
            await _STOR.Post('tab-update',  tab);
        }
        
        // [Select] 오픈한 다이어그램의 자식들 조회.
        const select = await _STOR.Post('diagram-index', {
            indexName: 'parentId',
            findKey: openDiagram.axis.id
        });

        // [Map] Space 에 조회된 다이어그램 목록 저장.
        _SPCE.InitLoad(openDiagram, select);
        
        return true;
    }
    catch(error) {
        console.error(error);
        
        return false;
    }
}