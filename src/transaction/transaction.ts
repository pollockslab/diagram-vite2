import { type C_ } from './command.type'
import {_MAIN as _CMD} from './command'




export class _MAIN 
{
   
    queue = [] as C_.ICommand[];
    nowOrder = -1 as number;
    

    constructor()
    {
        // indexeddb에서 정보 가져오기? or 캐시메모리에서 가져오기
        // indexeddb 에서 가져오는 이유? 탭마다 다르니까. 그럼 이걸 호출할적에
        // 탭이 바뀌면 매번 갱신 vs 이 객체를 탭마다 부여.
        // 일단 탭이 어떤식으로 바뀔지부터 확정해.
        // 1: 크롭탭: 여러개의 맵을 탭형태로 로드(어찌해야할지 못정함. 그리는건 찰나같은데)
        // 탭 새로 누를때마다 매번 새로 그리면 깜빡임은 있겠지. 근데 이미지 큰거면?
        // 2: 리모콘에서 이동: (하나의 맵만 보고, 탭이동시 맵 매번 새롭게 로드)
    }

    // 앞으로 돌리기 (ctrl + y)
    Redo()
    {
        //  현재랑 같아서 바뀔점이 없으면 리턴
        if(this.nowOrder >= this.queue.length-1) {
            this.nowOrder = this.queue.length-1;
            return;
        } 



        this.nowOrder += 1;
    }

    // 뒤로 돌리기 (ctrl + z)
    Undo()
    {
        this.nowOrder -= 1;
    }
}

