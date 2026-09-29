import { _TAB, _SPCE, _STOR, _MNGR } from '@/main'
import * as IndexeddbType from '@/engines/indexeddb/indexeddb.type'
import * as DiagramsType from '@/diagrams/diagrams.type'

export async function LoadTX(
    cmd: IndexeddbType.StoreCommand,
    
): Promise<void> {
    // 1. view 화면 보여지는 크기 구해와(scope 포함)
    // 2. 보여지는 크기에서 가져올 그리드 목록(x1000, y1000) 구하기
    // 3. space.grid 목록추가
    // 4. space.diagrams 에 목록추가
    

}