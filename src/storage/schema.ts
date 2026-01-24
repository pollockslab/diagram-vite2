
export interface ISetting {
    id: number;
    openTabID: string | null;
}

export interface ITab {
    id: string;
    openDiagramID: string;
    favorites: boolean;
    timestamp: number;
}

export interface IDiagram {
    id: string;
    ui: any; 
    parentID: string | null;
    tabID: string | null;
}

export interface ILog {
    id?: number; // autoIncrement이므로 선택적
    code: string;
    ext: string;
    timestamp: number;
}

export interface IVersionHistory {
    version: number;
    versionPrev: number | null;
    workDate: string;
    timestamp: number;
}

// 2. DB 생성용 실행 스키마 (IndexedDB 오픈 시에만 참조)
export const _SCHEMA = {
    version: 3,
    work_date: '2026-01-24 03:50',
    tables: {
        setting: {
            options: { keyPath: 'id', autoIncrement: false },
            index: []
        },
        tab: {
            options: { keyPath: 'id', autoIncrement: false },
            index: []
        },
        diagram: {
            options: { keyPath: 'id', autoIncrement: false },
            index: [{ key: 'byParentID', column: 'parentID', options: { unique: false } }]
        },
        log: {
            options: { keyPath: 'id', autoIncrement: true },
            index: []
        },
        version_history: {
            options: { keyPath: 'version', autoIncrement: false },
            index: []
        }
    }
} as const;