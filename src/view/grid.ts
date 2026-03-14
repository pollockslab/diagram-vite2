
import * as DiagramsType from '../diagrams/diagrams.type'


type ChildrenKeys = { [key in DiagramsType.ClassName]: String[]; }

export class Grid {

    size = {
        w: 100,
        h: 100,
    };
    map  = {
        grid        : new Map<string, ChildrenKeys>(),
        serialize   : new Map<string, DiagramsType.serialize.Axis>(),
    };

    constructor() {}

    CollisionSlots(serialize: DiagramsType.serialize.Axis): string[] {
        const slots: string[] = [];
        const {x, y, w, h} = serialize.axis;

        const start = {
            col: Math.floor(x / this.size.w),
            row: Math.floor(y / this.size.h),
        };
        const end = {
            col: Math.floor((x+w) / this.size.w),
            row: Math.floor((y+h) / this.size.h),
        };

        for(let col=start.col; col<=end.col; col++) {
            for(let row=start.row; row<=end.row; row++) {
                slots.push(`${col*this.size.w},${row*this.size.h}`);
            }
        }
        return slots;
    }

    Update(serialize: DiagramsType.serialize.Axis): void {

        const now = serialize;
        if(now.axis.id == null) {return;}
        const old = this.map.serialize.get(now.axis.id);
        
        // [Filter] 기존 정보와 일치하면, 바뀔 내용이 없어서 Return.
        if(old === now) { return; }

        // [Update] 기존 슬롯들에 등록한 Key 초기화.
        this.Delete(now);
        this.map.serialize.set(now.axis.id, now);
        

        const slots: string[] = this.CollisionSlots(now);
        for(const slotKey of slots) {
            // [Insert] 슬롯이 없으면 추가.
            if(!this.map.grid.has(slotKey)) {
                const children = {
                    axis: [],
                    square: [],
                };
                this.map.grid.set(slotKey, children);
            }
            const slot = this.map.grid.get(slotKey);
            if(slot === undefined) {continue;}

            // [Insert] 다이어그램ID 추가.
            slot[now.axis.type].push(now.axis.id);
        }
    }

    Delete(serialize: DiagramsType.serialize.Axis): void {
        const nowId = serialize.axis.id;
        if(nowId === null) { return; }

        // [Delete] 자식 시리얼 목록에서 제거
        this.map.serialize.delete(nowId);

        // [Delete] 그리드 솔롯에서 전부 제거
        const slots: string[] = this.CollisionSlots(serialize);
        for(const slotKey of slots) {
            const slot = this.map.grid.get(slotKey);
            if(slot === undefined) {continue;}

            const list = slot[serialize.axis.type];
            for(let i=list.length-1; i>=0; i--) {
                const oldId = list[i];
                if(nowId === oldId) {
                    list.splice(i, 1);
                }
            }
        }
    }

    DeleteAll(): void {
        this.map.serialize.clear();
        this.map.grid.clear();
    }

    CollisionFirst() {

    }

    CollisionAll() {

    }
}