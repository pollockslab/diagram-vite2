export type ID = null | string;
export interface Tab {
    tab: {
        id:  ID;
        title: string;
    };
    favorite: Favorite;
    open    : Open;
}

export interface Favorite {
    list: string[];
}
    
export interface Open {
    space: {
        id: ID;
        x: number;
        y: number;
    };
}