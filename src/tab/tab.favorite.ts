import { _MNGR } from '@/main';
import * as TabType from './tab.type'


export class TabFavorite {

    list: string[] = [];

    constructor() {}

    static get origin(): TabType.Favorite {
        return {
            list: [],
        };
    }
    get serialize(): TabType.Favorite {
        return {
            list: this.list,
        };
    }
    set serialize(data: TabType.Favorite) {
        this.list = data.list;
    }

    Init() {
        this.serialize = TabFavorite.origin;
    }
}