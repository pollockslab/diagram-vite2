
import { _DPR } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'


export class Axis {
    id     : DiagramsType.ID = null;
    zIndex : number = 0;
    version: number = 0;
    type   : DiagramsType.ClassName = this.constructor.name as DiagramsType.ClassName;
    parent = {
        diagram: {
            id: null as DiagramsType.ID,
        },
        tab    : {
            id: null as DiagramsType.ID,
        },
    };

    constructor() {}

    static get origin(): DiagramsType.serialize.core.Axis {
        return {
            axis: {
                id      : null,
                zIndex  : 0,
                version : 0,
            },
            type: this.name as DiagramsType.ClassName,
            parent: {
                diagram: {
                    id: null,
                },
                tab: {
                    id: null,
                },
            },
        }
    }
    get serialize(): DiagramsType.serialize.core.Axis {
        return {
            axis: {
                id      : this.id,
                zIndex  : this.zIndex,
                version : this.version,
            },
            type    : this.type,
            parent: {
                diagram: {
                    id: this.parentDiagramID,
                },
                tab: {
                    id: this.parentTabID,
                },
            },
        };
    } 
    set serialize(data: DiagramsType.serialize.core.Axis) {
        // [Axie]
        this.id      = data.axis.id;
        this.zIndex  = data.axis.zIndex;
        this.version = data.axis.version;

        // [Type]
        this.type = data.type;

        // [Parent]
        this.parentDiagramID = data.parent.diagram.id;
        this.parentTabID     = data.parent.tab.id;
    }

    get parentDiagramID() {
        return this.parent.diagram.id;
    }
    set parentDiagramID(data: DiagramsType.ID) {
        this.parent.diagram.id = data;
    }
    get parentTabID() {
        return this.parent.tab.id;
    }
    set parentTabID(data: DiagramsType.ID) {
        this.parent.tab.id = data;
    }

    static create(args: Partial<any> = {}) {
        const instance = new this();
        instance.SetData(args);
        instance.Init();
        return instance;
    }

    // NOTE: 자식 클래스에서 오버라이드 위한 더미함수.
    Init() {}

    GetAnchorPoints(_width?: number, _height?: number): {x: number, y: number}[] {
        return [];
    }
    
    SetData(args: Partial<any> = {}): void {  
        for(const any in args) {
            const anyList = (args as any)[any];
            if(anyList && typeof anyList === 'object') {
                for(const getter in anyList) {
                    if(!(getter in this)) {continue;}
                    (this as any)[getter] = anyList[getter];
                }
            }
        }
    }

    Draw(_ctx?: CanvasRenderingContext2D) {}
}