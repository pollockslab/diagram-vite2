import { _MNGR } from '@/main';
import { TabFavorite } from './tab.favorite';
import { TabOpen } from './tab.open';
import * as TabType from './tab.type'


export class Tab {

    id: TabType.ID = null;
    private tab = {
        title: '* 새 탭' as string,
    };

    favorite: TabFavorite;
    open: TabOpen;
   
    constructor() {
        this.favorite = new TabFavorite();
        this.open = new TabOpen();
    }

    static get origin(): TabType.Tab {
        return {
            tab: {
                id: null,
                title: '* 새 탭',
            },
            favorite: TabFavorite.origin,
            open: TabOpen.origin,
        }
    }

    get serialize(): TabType.Tab {
        return {
            tab: {
                id: this.id,
                title: this.title,
            },
            favorite: this.favorite.serialize,
            open: this.open.serialize,
        };
    }
    set serialize(data: TabType.Tab) {
        // [Tab]
        this.id = data.tab.id;
        this.title = data.tab.title;
        
        // [Favorite]
        this.favorite.serialize = data.favorite;

        // [Open]
        this.open.serialize = data.open;
    }

    get title(): string {
        return this.tab.title;
    }
    set title(data: string) {
        // [Rule] 제목길이 최대 30자 제한.
        this.tab.title = data.trim().slice(0, 30);
    }

    Init() {
        this.serialize = Tab.origin;
    }
}