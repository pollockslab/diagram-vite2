import { type _DT, _DC } from '../diagrams/diagrams.type'
import { type _TT } from './transaction.type'
import { _MAIN as _COMM } from './command'
import { _VIEW, _STOR } from '../main'



export class _MAIN 
{
   
    queue = [] as _TT.ICommand[];
    nowOrder = -1 as number;

    constructor()
    {
 
    }

    // 현재 상태를 저장
    private Exec(commandID:string, mementos:_TT.IMemento[])
    {
        const nextOrder = this.nowOrder + 1;
        this.queue = [...this.queue.slice(0, nextOrder),
             {commandID, mementos}];
        this.nowOrder = this.queue.length - 1;


        console.log('[Exec]', this.queue, this.nowOrder);
    }

    // 앞으로 돌리기 (ctrl + y)
    Redo()
    {
        //  현재랑 같아서 바뀔점이 없으면 리턴
        if(this.nowOrder >= this.queue.length - 1) {
            return;
        } 

        this.nowOrder += 1;
        const currentCmd = this.queue[this.nowOrder];
        console.log('[Redo]', currentCmd);
    }

    // 뒤로 돌리기 (ctrl + z)
    async Undo()
    {
        if(this.nowOrder < 0) {
            this.nowOrder = -1;
            return;
        }

        const currentCmd = this.queue[this.nowOrder];

        // 복원하기
        for(let memento of currentCmd.mementos) {
            
            const old = memento.old;
            const now = memento.now;
            // 4개가 있는건가
            if(old === null) {
                if(now === null) {
                    // 이럴경우를 안만들꺼임
                }
                else {
                    // 이런경우 다시 없애야겠지.
                    // 근데 현재 탭이 속한 탭이 아니면 해당 탭으로
                    // 건너가서 해당 지우는 위치로 가져야되는데
                    // 다이어그램 무브도 받을꺼긴 한데.
                    // 그럼 여기서 해당 위치까지만 가고
                    // 큐를 냅두고 종료하자.
                    // 다음번에 다시 undo 하면 그때 맞춰지니까 지우게

                    // 1. db삭제
                    await _STOR.Call('deleteDiagram', now.serialize);
                    // 2. 보이는거 삭제
                    _VIEW.DeleteChild(now);
                    console.log('삭제했다')
                }
            }
            else {
                if(now === null) {

                }
                else {
                    
                }
            }
        }


        this.nowOrder -= 1;
        console.log('[Undo]', currentCmd, this.nowOrder);
    }

    /**
     * 사용처: 리모콘
     * @param type 
     * @param x 
     * @param y 
     */
    async AddDiagram(type:_DT.CHILD_NAME, x:number, y:number)
    {
        // 1. 객체생성
        const instance = _VIEW.AddChild({
            type, x, y,
            
            id: crypto.randomUUID(),
            parentID: _VIEW.id,
            tabID: _VIEW.tabID,
            zIndex: Date.now(),
        });
        if(!instance) return;
        
        // 3. DB저장 -> 실패시 배열에서 빼야지
        await _STOR.Call('saveDiagram', instance.serialize);

        // 4. execute
        const memento = {
            old: null,
            now: instance,
        };
        this.Exec('AddDiagram', [memento]);
    }
}

