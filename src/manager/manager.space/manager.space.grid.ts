import { _VIEW, _TAB, _SPCE, _STOR, _MNGR } from '@/main'
import * as IndexeddbType from '@/engines/indexeddb/indexeddb.type'
import * as DiagramsType from '@/diagrams/diagrams.type'

export async function LoadTX(cmd: IndexeddbType.StoreCommand): Promise<void> {
    // 1. view 화면 보여지는 크기 구해와(scope 포함)
    const rect = _VIEW.GetRect();


    // 2. 보여지는 크기에서 가져올 그리드 목록(x1000, y1000) 구하기
    // 3. space.grid 목록추가
    // 4. space.diagrams 에 목록추가
    



    // 콜리전 체크를 해야되나? 여튼 현재 화면의 좌표
            // 상, 하, 좌, 우 좌표 구해서 1000x1000 그리드 좌표 구해봐
            // 그리고 목록으로 만들고 그리드 IDB 조회해오기
            // 조회결과를 space.gridList 에도 넣고, 
            // 전체 다이어그램 객체 space.diagrams 에도 넣고
            // 넣은이후 루프에 draw 예약하기
            // View 에서는 space.diagrams 들 다 그린다.
            // 화면에 보이는것만 그리도록 하는게 맞나. 
            // chain 만은 예외로 그리는게 맞을수도(매번 기울기 계산하는거보다 그리는게)
            
            // 컨트롤러든, 메인이든 루프든 특정 좌표를 기준으로 그리드 목록 생성해서
            // 스페이스에 저장되게 하면 돼.
            // 가지고 있고, 뷰어에서 그리고싶은 부분을 찾아서 그리면 되는거고
            // 그럼 현재 위치는 뷰어에 물어보면 되겠네
            // 뷰어에서 x, y 좌표, 돋보기 기능 포함 전체 보이는 넓이도 가지고 오고
            // 1. manager.space 에 화면크기에서 그리드 몇개 들어가나 반환하는 함수
            // 2. 이 함수 반환값으로 그리드 정보 idb에서 가져오기
            // 3. 정보가 없으면 굳이 그리드 생성 안하기
            // 4. space.diagrams 에 그리드 정보대로 다이어그램 객체 넣기
            // 5. 뷰어에서 현재 화면 보이는곳을 그리기 위해 space 모듈에서 정보찾기
            // 6. 찾은 정보로 그리면 됨.

}