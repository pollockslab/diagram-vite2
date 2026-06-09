import { _MNGR } from '@/main'

import * as MementoType     from './memento.type'

// 현재 상태를 저장
// 비포니, 애프터니 저장할 필요 없는게, 다이어그램 상태는 변경됐어.
// 그래서 그 상태에서 undo 를 하면 undo 스택 마지막을 now 로 올리고,
// before 로 다시 만들 뿐이야. 현재가 before가 된걸 메모리로 가지고 있을
// 필요가 없다. 커맨드ID도 diagram-insert, space-move 정도 
export class Memento {
    history: MementoType.Memento[] = [];
    nowOrder = -1;
    
    constructor() {}

    /**
     * [Function] InitLoad
     * @description 탭 변경 시, 호출하여 메멘토 초기화.
     * @param args: {history: MementoType.Memento[], order: number}
     */
    InitLoad(args: {
        history: MementoType.Memento[],
        nowOrder : number
    }) {
        this.history = args.history;
        this.nowOrder  = args.nowOrder;
    }
 
    /**
     * [Function] Exec
     * @description 명령 저장
     * @param command 'diagram' | 'space-move'
     * @param list [
        {
            before: diagram.serialize,
            after : diagram.serialize
        },
        {
            before: diagram.serialize,
            after : diagram.serialize
        },...(배열)]
     */
    Exec(command: MementoType.Command, list: MementoType.work[]) {

        // [Now] 미래 시점으로 1 증가
        this.nowOrder++;

        // [Redo] 미래 데이터 제거
        this.history.splice(this.nowOrder);
        
        // [Exec] 새로운 데이터 추가
        this.history.push({command, list})
    }

    /**
     * [Function] Redo
     * @description 앞으로 돌리기 (Ctrl + Y)
     */
    async Redo() {
        // [Validation] 미래 시점이 없다면 리턴.
        if(this.nowOrder >= this.history.length - 1) {return;}

        this.nowOrder++;
        await this.After();
    }

    /**
     * [Function] Undo
     * @description 뒤로 돌리기 (Ctrl + Z)
     */
    async Undo()
    {
        // [Validation] 과거 시점이 없다면 리턴.
        if(this.nowOrder < 0) {return;}    

        await this.Before();
        this.nowOrder--;
    }

    // [Commit] Now 데이터를 after -> before 로 실행.
    async Before() {
        const now = this.history[this.nowOrder];

        switch(now.command) {
            case 'diagram':
                for(const work of now.list) {
                    
                    if(work.after !== null && work.before === null) {
                        // [Delete] 다이어그램 삭제
                        await _MNGR.diagram.Delete(work.after, {isMementoPush: false});
                    }
                    else if(work.after === null && work.before !== null) {
                        // [Insert] 다이어그램 생성
                        await _MNGR.diagram.Insert(work.before, {isMementoPush: false});
                    }
                    else if(work.after !== null && work.before !== null) {
                        // [Update] 다이어그램 수정
                        await _MNGR.diagram.Update(work.before, {isMementoPush: false});
                    }
                }
                break;
            case 'space-move':
                if(now.list.length <= 0) {break;}
                
                const work = now.list[0];

                // [Validaion] 이동할 다이어그램 존재 확인
                if(work.after === null || work.before === null) {break;}

                // [Space] 맵 이동
                await _MNGR.space.Move(work.before);

                break;
        }
    }

     // [Commit] Now 데이터를 before -> after 로 실행.
    async After() {
        const now = this.history[this.nowOrder];

        switch(now.command) {
            case 'diagram':
                for(const work of now.list) {
                    
                    if(work.before !== null && work.after === null) {
                        // [Delete] 다이어그램 삭제
                        await _MNGR.diagram.Delete(work.before, {isMementoPush: false});
                    }
                    else if(work.before === null && work.after !== null) {
                        // [Insert] 다이어그램 생성
                        await _MNGR.diagram.Insert(work.after, {isMementoPush: false});
                    }
                    else if(work.before !== null && work.after !== null) {
                        // [Update] 다이어그램 수정
                        await _MNGR.diagram.Update(work.after, {isMementoPush: false});
                    }
                }
                break;
            case 'space-move':
                if(now.list.length <= 0) {break;}
                
                const work = now.list[0];

                // [Validaion] 이동할 다이어그램 존재 확인
                if(work.after === null || work.before === null) {break;}

                // [Space] 맵 이동
                await _MNGR.space.Move(work.after);

                break;
        }
    }

}

