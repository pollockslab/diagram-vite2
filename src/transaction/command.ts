
import { type _DT, _DC } from '../diagrams/diagrams.type'
import { _VIEW } from '../main'


/**
 * [커맨드 함수 뭐있나 적어보자 - Redo Undo Exec 들어갈 단위로 생각해라]
 * 
 * 1. AddDiagram 
 * 2. DeleteDiagram
 * 3. MoveDiagram
 * 4. ResizeDiagram
 * 5. SaveDiagram (뭘 저장했는지 대응이 힘듬. 텍스트인지 그냥 바뀐게 없는지)
 * 6. TextEdit ( saveDiagram 보다 이렇게 쪼개면 undo 는 가능해보인다)
 * 7. 그럼 말마따나 변경전 변경후의 다이어그램 정보를 저장해두는게
 *    확실하다. 반대함수를 생각할게 아니고. 
 *      그렇게 되면 tran.queue 에 COMM 을 저장하는게 아니고 행위가
 *       복원될 정보만 저장하면 돼 comm 은 필요없음
 *   ---> COMM 함수를 외부에서 실행하면 각각 알맞게 Exec로 넘기면
 *   ----> 저장되는거
 *   ----> SaveDiagram 같은걸 무시하는법은 데이터가 같으면 exec 에서 거르기
 *   -----> 그럼 기본으로 다이어그램 단위로 나타난다? 
 *   ------> 일괄 선택해서 한꺼번에 옮기면 어떻게해. 통짜저장을?
 *   -------> 이미지도 아이디로 타서 이미지 자체 저장을 안해보자. 한번만 저장되게
 *   --------> 이걸 어떻게해? 애초에 같은이미지를 다른 다이어그램. 이건 나뉘어
 *   ------> 문제는 여러 다이어그램. 삭제했어. 다시 undo 시 삭제된 이미지 어떡해
 *   -----> 요것만 해결하면 돼. 그럼 어느지점까지 삭제정보를 들고있을까
 *  -----> 날짜는 안되고. 몇턴몇턴 들고있어야됨. 
 *   ***그러자니 이미지도 아이디로만 딸수없고 exec에 들고있어야 된다?
 */

export const _MAIN = {
    
    

    /**
     * 사용처: 리모콘
     * @param type 
     * @param x 
     * @param y 
     */
    AddDiagram(type:_DT.CHILD_NAME, x:number, y:number)
    {
        // 인단 만들어봐
        console.log(type, x, y);
        const instance = _VIEW.AddChild({
            // 파라미터
            type,
            x,
            y,

            // 필수속성
            id: crypto.randomUUID(),
            parentID: _VIEW.id,
            tabID: _VIEW.tabID,
            zIndex: Date.now(),
        });

        console.log(instance);
        // 1. 객체생성
        // 2. 초기화 및 렌더링
        // 3. DB저장
        // 4. 탭 현재 view에 넣기
        // 5. 그리기
    },

    DeleteDiagram()
    {
        // 1. 찾기
        // 2. DB제거
        // 3. 탭 현재 view에서 제거
        // 4. 그리기

        // Redo, Undo 에서 서로 호출이다. 대칭개념에 빠지지 말자
        // 서로의 Undo 가 다를 수 있음
        
    },


}
