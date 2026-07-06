
import { _DPR } from '@/main'
import { AxisGrid } from './axis.grid';
import * as DiagramsType from '@/diagrams/diagrams.type'

export const gridSize = {x: 100, y: 100};

export class Axis implements DiagramsType.serialize.core.Axis {

    axis = {
        type     : 'Axis' as DiagramsType.ClassName,
        id       : null as string | null,
        zIndex   : 0 as number,
        parentId : null as string | null,
        tabId    : null as string | null,
    };
    space = {
        grid: {
            
        },
    };


    constructor() {}

    get serialize(): DiagramsType.serialize.core.Axis {
        return {
            axis: {
                type        : this.type,
                id          : this.id,
                zIndex      : this.zIndex,
                parentId    : this.parentId,
                tabId       : this.tabId,
            },
            // space 는 코어.axis 에서는 못하고 점,선,면 에서 넣어야되겠는데. 그럼
            // 오버라이드 함수로 만들어야겠지
            space: {
                grid: {
                    id: '',
                    list: [
                        {x: 100, y: 100},
                        {x: 100, y: 200},
                        {x: 200, y: 200},
                        {x: 200, y: 100},
                    ],
                }
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
    
    get tabId() {
        return this.axis.tabId;
    }
    set tabId(value) {
        this.axis.tabId = value;
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