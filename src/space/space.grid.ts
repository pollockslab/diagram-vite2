import * as Diagrams from '@/diagrams/diagrams'
import * as DiagramsType from '@/diagrams/diagrams.type'

export class SpaceGrid {
    private size = { w: 100, h: 100 };
    private grid = new Map<string, string[]>();
    private slot = new Map<string, string[]>();

    constructor() {}

    Init() {
        this.grid.clear();
        this.slot.clear();
    }

    SelectByPoint(x: number, y: number): string[] {
        const x1 = this.GetGridPos(x, this.size.w);
        const y1 = this.GetGridPos(y, this.size.h);
        const key = this.MakeKey(x1, y1);
        const grid = this.grid.get(key);

        return grid ?? [];
    }

    SelectBySquare(x: number, y: number, w: number, h: number): string[] {
        const x1 = this.GetGridPos(x, this.size.w);
        const y1 = this.GetGridPos(y, this.size.h);
        const x2 = this.GetGridPos(x+w, this.size.w);
        const y2 = this.GetGridPos(y+h, this.size.w);

        const idSet = new Set<string>();

        for(let col=x1; col<=x2; col+=this.size.w) {
            for(let row=y1; row<=y2; row+=this.size.h) {
                const key = this.MakeKey(col, row);
                const grid = this.grid.get(key);
                grid?.forEach((id: string) => {
                    idSet.add(id);
                });
            }    
        }
        return [...idSet];
    }

    Insert(input: DiagramsType.Instance | DiagramsType.Instance[]) {
        const list = Array.isArray(input)? input:[input];
        
        for(const diagram of list) {
            if(diagram.id === null) {continue;}

            if (diagram instanceof Diagrams.Class.Line) {
                // Bresenham 방식: 선이 지나가는 모든 Grid slot 좌표 확보
                let x1 = Math.floor(diagram.line.x1 / this.size.w);
                let y1 = Math.floor(diagram.line.y1 / this.size.h);
                let x2 = Math.floor(diagram.line.x2 / this.size.w);
                let y2 = Math.floor(diagram.line.y2 / this.size.h);

                let dx = Math.abs(x2 - x1);
                let dy = Math.abs(y2 - y1);
                let sx = x1 < x2 ? 1 : -1;
                let sy = y1 < y2 ? 1 : -1;
                let err = dx - dy;

                while (true) {
                    this.AddSlot(x1 * this.size.w, y1 * this.size.h, diagram);

                    if (x1 === x2 && y1 === y2) {break;}
                    
                    let e2 = 2 * err;
                    if (e2 > -dy) { err -= dy; x1 += sx; }
                    if (e2 <  dx) { err += dx; y1 += sy; }
                }
            }
            else if(diagram instanceof Diagrams.Class.Square) {
            
                const x = diagram.square.x;
                const y = diagram.square.y;
                const w = diagram.square.w;
                const h = diagram.square.h;

                const x1 = this.GetGridPos(x, this.size.w);
                const y1 = this.GetGridPos(y, this.size.h);
                const x2 = this.GetGridPos(x+w, this.size.w);
                const y2 = this.GetGridPos(y+h, this.size.w);

                for(let col=x1; col<=x2; col+=this.size.w) {
                    for(let row=y1; row<=y2; row+=this.size.h) {
                        this.AddSlot(col, row, diagram);
                    }    
                }
            }
            else if(diagram instanceof Diagrams.Class.Point) {
                const x = this.GetGridPos(diagram.point.x, this.size.w);
                const y = this.GetGridPos(diagram.point.y, this.size.h);
                this.AddSlot(x, y, diagram);
            }
        }
    }

    // 마우스 이벤트마다 하지말고 Loop 에서 호출하게 하자(트랜잭션 예약으로)
    Update(input: DiagramsType.Instance | DiagramsType.Instance[]) {
        const list = Array.isArray(input)? input:[input];
        
        for(const diagram of list) {
            if(diagram.id === null) {continue;}
            
            this.Delete(diagram);
            this.Insert(diagram);
        }
    }

    Delete(input: DiagramsType.Instance | DiagramsType.Instance[]) {
        const list = Array.isArray(input)? input:[input];
        
        for(const diagram of list) {
            // [Validation] ID 확인
            const id = diagram.id;
            if(id === null) {continue;}

            // [SlotKeys] 제거
            const slotKeys = this.slot.get(id);
            if(!slotKeys) {return;}
            
            this.slot.delete(id);

            // [Grid] 제거
            for(const key of slotKeys) {
                const slot = this.grid.get(key);
                if(!slot) {return;}

                const i = slot?.findIndex(findID => findID === id);
                if(i !== -1) {
                    slot.splice(i, 1);
                }
            }
        }
    }
    
    GetGridPos(point: number, size: number) {
        return Math.floor(point/size)*size;
    }

    MakeKey(x: number, y: number) {
        return `${x},${y}`;
    }

    private AddSlot(x: number, y: number, diagram: DiagramsType.Instance) {
        // [Validation] ID 확인
        const id = diagram.id;
        if(!id) {return;}
        const key = this.MakeKey(x, y);

        // [Grid] 업데이트
        const grid = this.grid.get(key) ?? [];
        this.grid.set(key, [...grid, id]);

        // [Slot] 업데이트
        const slot = this.slot.get(id) ?? [];
        this.slot.set(id, [...slot, key])
    }
}
