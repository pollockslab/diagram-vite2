
import { _DPR } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'


export class Axis implements DiagramsType.serialize.core.Axis {

    axis = {
        id      : {
            diagram : null as DiagramsType.ID,
            space   : null as DiagramsType.ID,
            tab     : null as DiagramsType.ID,
        },
        type    : 'Axis' as DiagramsType.ClassName,
        zIndex  : 0 as number,
    };

    constructor() {}

    get serialize(): DiagramsType.serialize.core.Axis {
        return {
            axis: {
                id      : {
                    diagram : this.diagramID,
                    space   : this.spaceID,
                    tab     : this.tabID,
                },
                type    : this.type,
                zIndex  : this.zIndex,
            },
        };
    } 

    get diagramID() {
        return this.axis.id.diagram;
    }
    set diagramID(value: DiagramsType.ID) {
        this.axis.id.diagram = value;
    }

    get spaceID() {
        return this.axis.id.space;
    }
    set spaceID(value: DiagramsType.ID) {
        this.axis.id.space = value;
    }
    
    get tabID() {
        return this.axis.id.tab;
    }
    set tabID(value: DiagramsType.ID) {
        this.axis.id.tab = value;
    }

    get type() {
        return this.axis.type;
    }
    set type(value: DiagramsType.ClassName) {
        this.axis.type = value;
    }

    get zIndex() {
        return this.axis.zIndex;
    }
    set zIndex(value: number) {
        this.axis.zIndex = value;
    }

    static create(args: Partial<any> = {}) {
        const instance = new this();
        instance.SetData(args);
        instance.axis.type = this.name as DiagramsType.ClassName;
        instance.Init();
        return instance;
    }

    Init() {}
    
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

    SetSpace() {}

    Draw(_ctx?: CanvasRenderingContext2D) {}
}