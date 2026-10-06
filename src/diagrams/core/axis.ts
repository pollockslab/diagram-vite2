import { PatchObjectDeep } from '@/engines/common'
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
                    id: this.parent.diagram.id,
                },
                tab: {
                    id: this.parent.tab.id,
                },
            },
        };
    } 
    set serialize(data: DiagramsType.serialize.core.Axis) {
        // [Axis]
        this.id      = data.axis.id;
        this.zIndex  = data.axis.zIndex;
        this.version = data.axis.version;

        // [Type]
        this.type = data.type;

        // [Parent]
        this.parent.diagram.id = data.parent.diagram.id;
        this.parent.tab.id     = data.parent.tab.id;
    }
    
    SetData<T extends Record<string, any>>(data: Partial<T>) {
        this.serialize = PatchObjectDeep(this.serialize, data);
    }

    // NOTE: 자식 클래스에서 오버라이드 위한 더미함수.
    async AfterCreate() {}
    GetAnchorPoints(_width?: number, _height?: number): {x: number, y: number}[] {
        return [];
    }
    Draw(_ctx?: CanvasRenderingContext2D) {}
}