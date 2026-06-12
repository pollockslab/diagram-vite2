

export interface Settings {
    id: number,
    openTabId: string | null,
}
export interface Tab {
    id: string | null, // tabId
    openDiagramId: string | null, //axis.id,
    favorite: [],
    mementos: {
        history: [],
        nowOrder : number, //-1
    },
}
    