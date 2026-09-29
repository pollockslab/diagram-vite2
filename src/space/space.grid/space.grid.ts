import * as Diagrams from '@/diagrams/diagrams'
import * as DiagramsType from '@/diagrams/diagrams.type'
import * as SpaceType from '../space.type'

export class SpaceGrid {
    static readonly GRID_WIDTH  = 1000;
    static readonly GRID_HEIGHT = 1000;
    private size = { width: SpaceGrid.GRID_WIDTH, height: SpaceGrid.GRID_HEIGHT };
    private grid = new Map<string, string[]>();
    private slot = new Map<string, string[]>();

    id: SpaceType.ID = null;
    space_grid = {
        x1000: 0 as number,
        y1000: 0 as number,
    };
    self = {
        diagram: {
            id: null as SpaceType.ID,
        },
    };

    constructor() {}

    static get origin(): SpaceType.serialize.Grid {
        return {
            space_grid: {
                id: null,
                x1000: 0,
                y1000: 0,
            },
            children: {
                diagram: {
                    list: [],
                },
            },
            self: {
                diagram: {
                    id: null,
                },
            },
        }
    }
    get serialize(): SpaceType.serialize.Grid {
        return {
            space_grid: {
                id: this.id,
                x1000: this.x1000,
                y1000: this.y1000,
            },
            children: {
                diagram: {
                    list: this.list,
                },
            },
            self: {
                diagram: {
                    id: this.selfDiagramID,
                },
            },
        }
    }
    set serialize(data: SpaceType.serialize.Grid) {
        this.id     = data.space_grid.id;
        this.x1000  = data.space_grid.x1000;
        this.y1000  = data.space_grid.y1000;
        this.list   = data.children.diagram.list; // FIXME: 매니저에서 넣어줘야될듯.
        this.selfDiagramID = data.self.diagram.id;
    }

    get x1000(): number {
        return this.space_grid.x1000;
    }
    set x1000(data: number) {
        // NOTE: 내림. (-3.8 => -4), (3.8 => 3)
        this.space_grid.x1000 = Math.floor(data);
    }
    get y1000(): number {
        return this.space_grid.y1000;
    }
    set y1000(data: number) {
        // NOTE: 내림. (-3.8 => -4), (3.8 => 3)
        this.space_grid.y1000 = Math.floor(data);
    }
    get selfDiagramID(): SpaceType.ID {
        return this.self.diagram.id;
    }
    set selfDiagramID(data: SpaceType.ID) {
        this.self.diagram.id = data;
    }
    
    get list(): string[] {
        // FIXME: 그리드 맵 코딩 이후, 맵에서 배열목록으로 추출하도록 코딩필요
        return [];
    }
    set list(data: string[]) {
        // FIXME: 그리드 맵 코딩 이후, 맵에서 배열목록으로 추출하도록 코딩필요
    }

    // get list(): SpaceType.GridList {
    //     const record: SpaceType.GridList = {};
    //     for (const [key, value] of this.grid) {
    //         // [Copy] 배열 자체를 새로 복사
    //         record[key] = [...value]; 
    //     }
    //     return record;
    // }
    // set list(data: SpaceType.GridList) {
    //     this.grid = new Map(
    //         Object.entries(data).map(([key, value]) => [key, [...value]])
    //     );
    // }

    Init() {
        this.serialize = SpaceGrid.origin;
    }

    // [FIXME] 다이어그램 코어모듈에서 GetPos 함수를 제공하는게 맞아보이는데
    SelectByPoint(x: number, y: number): string[] {
        const x1 = this.GetGridPos(x, this.size.width);
        const y1 = this.GetGridPos(y, this.size.height);
        const key = this.MakeKey(x1, y1);
        const grid = this.grid.get(key);

        return grid ?? [];
    }

    SelectBySquare(x: number, y: number, w: number, h: number): string[] {
        const x1 = this.GetGridPos(x, this.size.width);
        const y1 = this.GetGridPos(y, this.size.height);
        const x2 = this.GetGridPos(x+w, this.size.width);
        const y2 = this.GetGridPos(y+h, this.size.height);

        const idSet = new Set<string>();

        for(let col=x1; col<=x2; col+=this.size.width) {
            for(let row=y1; row<=y2; row+=this.size.height) {
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
                let x1 = Math.floor(diagram.line.x1 / this.size.width);
                let y1 = Math.floor(diagram.line.y1 / this.size.height);
                let x2 = Math.floor(diagram.line.x2 / this.size.width);
                let y2 = Math.floor(diagram.line.y2 / this.size.height);

                let dx = Math.abs(x2 - x1);
                let dy = Math.abs(y2 - y1);
                let sx = x1 < x2 ? 1 : -1;
                let sy = y1 < y2 ? 1 : -1;
                let err = dx - dy;

                while (true) {
                    this.AddSlot(x1 * this.size.width, y1 * this.size.height, diagram);

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

                const x1 = this.GetGridPos(x, this.size.width);
                const y1 = this.GetGridPos(y, this.size.height);
                const x2 = this.GetGridPos(x+w, this.size.width);
                const y2 = this.GetGridPos(y+h, this.size.width);

                for(let col=x1; col<=x2; col+=this.size.width) {
                    for(let row=y1; row<=y2; row+=this.size.height) {
                        this.AddSlot(col, row, diagram);
                    }    
                }
            }
            else if(diagram instanceof Diagrams.Class.Point) {
                const x = this.GetGridPos(diagram.point.x, this.size.width);
                const y = this.GetGridPos(diagram.point.y, this.size.height);
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
            if(!slotKeys) {continue;}
            
            this.slot.delete(id);

            // [Grid] 제거
            for(const key of slotKeys) {
                const slot = this.grid.get(key);
                if(!slot) {continue;}

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
