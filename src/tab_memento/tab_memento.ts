import { _MNGR } from '@/main'
import * as TabMementoType from './tab_memento.type'


/**
 * [Class] Memento
 * @description 작업정보를 실시간으로 저장하고, 
 *  필요 시 복원하는 기능을 하는 클래스. (Ctrl+Z, Ctrl+Y 기능)
 */
export class TabMemento {
    // [Config] 히스토리 최대 보관 개수. 초과 시 오래된 것부터 제거.
    static readonly MAX_HISTORY_SIZE = 50;

    id: TabMementoType.ID = null; 
    history: TabMementoType.History[] = [];
    nowOrder: number = -1;
    
    constructor() {}

    static get origin(): TabMementoType.TabMemento {
        return {
            tab_memento: {
                id: null,
                history: [],
                nowOrder: -1,
            },
        };
    }
    get serialize(): TabMementoType.TabMemento {
        return {
            tab_memento: {
                id: this.id,
                history: this.history,
                nowOrder: this.nowOrder,
            },
        };
    }
    set serialize(data: TabMementoType.TabMemento) {
        this.id = data.tab_memento.id;
        this.history = data.tab_memento.history;
        this.nowOrder = data.tab_memento.nowOrder;
    }

    Init() {
        this.serialize = TabMemento.origin;

    }

    /**
     * [Function] InitLoad
     * @description 탭 변경 시, 호출하여 메멘토 초기화.
     * @param args: {history: TabMementoType.Memento[], order: number}
     */
    InitLoad(args: {
        history: TabMementoType.History[],
        nowOrder : number
    }) {
        this.history = args.history ?? [];
        this.nowOrder  = args.nowOrder ?? -1;
    }
 
    /**
     * [Function] Exec
     * @description 명령 저장
     * @param command 'diagram' | 'space-move'
     * @param works [
        {
            before: diagram.serialize,
            after : diagram.serialize
        },
        {
            before: diagram.serialize,
            after : diagram.serialize
        },...(배열)]
     */
    Exec(command: TabMementoType.Command, works: TabMementoType.work[]) {

        console.log(works)
        // [Now] 미래 시점으로 1 증가
        this.nowOrder++;
        
        // [Redo] 미래 데이터 제거
        this.history.splice(this.nowOrder);
        
        // [Exec] 새로운 데이터 추가
        this.history.push({command, works});

        // [Limit] 최대 크기 초과 시 가장 오래된 항목부터 제거
        this.TrimHistory();
    }

    /**
     * [Function] TrimHistory
     * @description 히스토리가 최대 크기를 초과하면 오래된 항목을 제거하고,
     *  잘라낸 개수만큼 nowOrder도 함께 보정한다.
     * @returns 실제로 잘라냈으면 true, 아니면 false
     */
    TrimHistory(): boolean {
        const overflow = this.history.length - TabMemento.MAX_HISTORY_SIZE;
        if(overflow <= 0) { return false; }

        this.history.splice(0, overflow);
        this.nowOrder -= overflow;

        // [Safety] 혹시 모를 음수 방지.
        if(this.nowOrder < -1) {
            this.nowOrder = -1;
        }
        return true;
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
    private async Before() {
        const now = this.history[this.nowOrder];
        console.log(now)
        switch(now.command) {
            case 'diagram':
                for(const work of now.works) {
                    
                    if(work.after !== null && work.before === null) {
                        // [Delete] 다이어그램 삭제
                        await _MNGR.diagram.DeleteBySerialize(work.after, {isMementoPush: false});
                    }
                    else if(work.after === null && work.before !== null) {
                        // [Insert] 다이어그램 생성
                        await _MNGR.diagram.Insert(work.before, {isMementoPush: false});
                    }
                    else if(work.after !== null && work.before !== null) {
                        // [Update] 다이어그램 수정
                        await _MNGR.diagram.UpdateBySerialize(work.before, {isMementoPush: false});
                    }
                }
                break;
            case 'space-move':
                if(now.works.length <= 0) {break;}
                
                // const work = now.list[0];

                // // [Validaion] 이동할 다이어그램 존재 확인
                // if(work.after === null || work.before === null) {break;}

                // // [Space] 맵 이동
                // await _MNGR.space.Move(work.before);

                break;
        }
    }

    // [Commit] Now 데이터를 before -> after 로 실행.
    private async After() {
        const now = this.history[this.nowOrder];

        switch(now.command) {
            case 'diagram':
                for(const work of now.works) {
                    
                    if(work.before !== null && work.after === null) {
                        // [Delete] 다이어그램 삭제
                        await _MNGR.diagram.DeleteBySerialize(work.before, {isMementoPush: false});
                    }
                    else if(work.before === null && work.after !== null) {
                        // [Insert] 다이어그램 생성
                        await _MNGR.diagram.Insert(work.after, {isMementoPush: false});
                    }
                    else if(work.before !== null && work.after !== null) {
                        // [Update] 다이어그램 수정
                        await _MNGR.diagram.UpdateBySerialize(work.after, {isMementoPush: false});
                    }
                }
                break;
            case 'space-move':
                if(now.works.length <= 0) {break;}
                
                // const work = now.list[0];

                // // [Validaion] 이동할 다이어그램 존재 확인
                // if(work.after === null || work.before === null) {break;}

                // // [Space] 맵 이동
                // await _MNGR.space.Move(work.after);

                break;
        }
    }

}

