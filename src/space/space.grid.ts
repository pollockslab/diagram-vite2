import * as Diagrams from '@/diagrams/diagrams'
import * as DiagramsType from '@/diagrams/diagrams.type'


export class SpaceGrid {
    size = {
        w: 100,
        h: 100,
    };
    map = new Map<string, string[]>();

    constructor() {

        // const square = new Diagrams.Class.Square({
        //     axis: {id: '테스트 스퀘어1', parentId: 'aaaa1234'},
        //     square: {x: 0, w:400, h: 400},
        //     ddt: {a1:1234},
        //     d1: 111,
        // });
        // this.Update(square);
        // const list = this.Select(square);
        // console.log('square 목록: ', list);

        // const point = new Diagrams.Class.Point({
        //     axis: {id: '테스트 포인트1', parentId: 'aaaa1234'},
        //     point: {x: -13, w:300, h: 400},
        //     d1: 111,
        // });
        // this.Update(point);
        // const list2 = this.Select(point);
        // console.log('point 목록: ', list2);

        // const line = new Diagrams.Class.Line({
        //     axis: {id: '테스트 라인1', parentId: 'aaaa1234'},
        //     line: {x1: -500, y1: 0, x2: 500, y2: 200},
        //     ddt: {a1:1234},
        //     d1: 111,
        // });
        // this.Update(line);
        // const list3 = this.Select(line);
        // console.log('line 목록: ', list3);

        // // 범위찾기
        // console.log(this.SelectArea(0, 0, 300, 300, 0));
        // console.log(this.SelectArea(0, 0, 300, 300, 100));
    }

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
