import { _DPR, _VIEW, _CTRL, _REMO, _LOOP, _SPCE, _STOR, _MNGR, _SETT } from '@/main'


export async function Load(tabId: string) {
    
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
            openDiagram = _MNGR.diagram.Cover({axis: {tabId: tabId}});
            if(!openDiagram) {return false;}

            // [Save] 생성한 최상위 다이어그램 저장 .
            await _STOR.Post('diagram-insert',  openDiagram.serialize);
        }
        
        // [Select] 오픈한 다이어그램의 자식들 조회.
        const select = await _STOR.Post('diagram-index', {
            indexName: 'parentId',
            findKey: openDiagram.id
        });

        // [Map] Space 에 조회된 다이어그램 목록 저장.
        _SPCE.InitLoad(select);
        
        return true;
    }
    catch(error) {
        console.log(error);
        
        return false;
    }
}

export async function Move(serialize: any) {
    
}