import { _MNGR } from '@/main';
import * as TabType from './tab.type'


export class TabOpen {

    space = {
        id: null as TabType.ID,
        x: 0 as number,
        y: 0 as number,
    };
    
    constructor() {}

    static get origin(): TabType.Open {
        return {
            space: {
                id: null,
                x: 0,
                y: 0,
            },
        };
    }
    get serialize(): TabType.Open {
        return {
            space: {
                id: this.space.id,
                x: this.space.x,
                y: this.space.y,
            },
        };
    }
    set serialize(data: TabType.Open) {
        this.space.id = data.space.id;
        this.space.x = data.space.x;
        this.space.y = data.space.y;
    }

    Init() {
        this.serialize = TabOpen.origin;
    }
}