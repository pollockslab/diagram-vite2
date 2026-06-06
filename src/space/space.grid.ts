import * as Diagrams from '@/diagrams/diagrams'
import * as DiagramsType from '@/diagrams/diagrams.type'


export class SpaceGrid {
    size = {
        w: 100,
        h: 100,
    };
    map = new Map<string, string[]>();

    constructor() {}

    ClearAll() {
        this.map.clear();
    }

    Select(diagram: DiagramsType.Instance): string[] {
        const id = diagram.axis.id;
        const list = [];
        for (const [key, value] of this.map.entries()) {
            for (let i = value.length-1; i >= 0; i--) {
                if (value[i] === id) {
                    list.push(key);
                }
            }
        }
        return list;
    }
    
    SelectArea(x1: number, y1: number, x2: number, y2: number, SQUARE_MAX_SIZE = 1000): Set<string> {

        const find: Set<string> = new Set();
        const start = {
            x: this.GetGridPoint(x1 - SQUARE_MAX_SIZE, this.size.w),
            y: this.GetGridPoint(y1 - SQUARE_MAX_SIZE, this.size.h),
        };
        const end = {
            x: x2,
            y: y2,
        };
        // const end = {
        //     x: this.GetGridPoint(x2 - SQUARE_MAX_SIZE, this.size.w),
        //     y: this.GetGridPoint(y2 - SQUARE_MAX_SIZE, this.size.h),
        // };
        // console.log(start, end)
        for(let x = start.x; x <= end.x; x += this.size.w) {
                for(let y = start.y; y <= end.y; y += this.size.h) {
                const key = `${x},${y}`;
                if (this.map.has(key)) {
                    const list = this.map.get(key);
                    for(const diagramId of list ?? []) {
                        find.add(diagramId);
                    }
                } 
            }
        }
        return find;
    }

    private Insert(diagram: DiagramsType.Instance) {
        if(diagram.axis.id === null) {return;}

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
                this.AddSlot(x1 * this.size.w, y1 * this.size.h, diagram.axis.id);

                if (x1 === x2 && y1 === y2) {break;}
                
                let e2 = 2 * err;
                if (e2 > -dy) { err -= dy; x1 += sx; }
                if (e2 <  dx) { err += dx; y1 += sy; }
            }
        }
        else if(diagram instanceof Diagrams.Class.Square) {
           
            const start = {
                x: this.GetGridPoint(diagram.square.x, this.size.w),
                y: this.GetGridPoint(diagram.square.y, this.size.h),
            };
            const end = {
                x: start.x + diagram.square.w,
                y: start.y + diagram.square.h,
            };

            for(let x = start.x; x < end.x; x += this.size.w) {
                for(let y = start.y; y < end.y; y += this.size.h) {
                    this.AddSlot(x, y, diagram.axis.id);
                }
            }
        }
        else if(diagram instanceof Diagrams.Class.Point) {
            const x = this.GetGridPoint(diagram.point.x, this.size.w);
            const y = this.GetGridPoint(diagram.point.y, this.size.h);
            this.AddSlot(x, y, diagram.axis.id);
        }
    }

    // 마우스 이벤트마다 하지말고 Loop 에서 호출하게 하자(트랜잭션 예약으로)
    Update(diagram: DiagramsType.Instance) {
        if(diagram.axis.id === null) {return;}
        this.Delete(diagram);
        this.Insert(diagram);
    }

    Delete(diagram: DiagramsType.Instance) {
        const id = diagram.axis.id;
        for (const value of this.map.values()) {
            for (let i = value.length-1; i >= 0; i--) {
                if (value[i] === id) {
                    value.splice(i, 1);
                }
            }
        }
    }
    
    GetGridPoint(point: number, size: number) {
        return Math.floor(point/size)*size;
    }

    private AddSlot(x: number, y: number, id: string) {
        const key = `${x},${y}`;

        if (!this.map.has(key)) {
            this.map.set(key, [id]);
        } 
        else {
            this.map.get(key)!.push(id);
        }
    }
    

}
