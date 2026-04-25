
import { _DPR } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'


export class Axis implements DiagramsType.serialize.core.Axis {

    axis = {
        type     : 'Axis' as DiagramsType.ClassName,
        id       : null as string | null,
        zIndex   : 0 as number,
        parentId : null as string | null,
    };

    constructor(args: Partial<any> = {}) {
        this.SetData(args);
    }
    get serialize(): DiagramsType.serialize.core.Axis {
        return {
            axis: {
                type        : this.type,
                id          : this.id,
                zIndex      : this.zIndex,
                parentId    : this.parentId,
            },
        };
    } 

    get type() {
        return this.axis.type;
    }
    set type(value) {
        this.axis.type = value;
    }

    get id() {
        return this.axis.id;
    }
    set id(value) {
        this.axis.id = value;
    }
    
    get zIndex() {
        return this.axis.zIndex;
    }
    set zIndex(value) {
        this.axis.zIndex = value;
    }

    get parentId() {
        return this.axis.parentId;
    }
    set parentId(value) {
        this.axis.parentId = value;
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

    Draw(ctx: CanvasRenderingContext2D) {}
}