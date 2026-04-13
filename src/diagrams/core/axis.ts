
import { _DPR } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'


export class Axis implements DiagramsType.serialize.core.Axis {

    tab = {
        id: null as string | null,
    };
    parent = {
        id: null as string | null,
    };
    axis = {
        type    : 'Axis' as DiagramsType.ClassName,
        id      : null as string | null,
        zIndex  : null as number | null,
    };

    constructor() {}
    get serialize(): DiagramsType.serialize.core.Axis {
        return {
            tab: {
                id: this.tab.id,
            },
            parent: {
                id: this.parent.id,
            },
            axis: {
                type:       this.type,
                id:         this.id,
                zIndex:     this.zIndex,
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
    
    SetData(args: Partial<any> = {}): void {
        Object.assign(this, args);
    }
}