export const Schema = [
    {   // [diagram] 컬럼: id | serialize
        name: 'diagram',
        keyPath: 'axis.id',
        indexList: [
            { name: 'type', keyPath: 'axis.type' },
            { name: 'zIndex', keyPath: 'axis.zIndex' },
            { name: 'parentId', keyPath: 'axis.parentId' },
            { name: 'tabId', keyPath: 'axis.tabId' },
        ]
    },
    {   // [space] 컬럼: id | grid (space.grid.serialize)
        // 이거 안쓰고 지워야함 (클로드코드가 없애야한다고 결론냄)
        name: 'space',
        keyPath: 'id',
        indexList: [
            { name: 'key', keyPath: '' },
        ]
    },
    {   // [tab] 컬럼: id | openDiagramId | favorite | mementoStack
        // 탭을 상단에 보여주던 안보여주고 스페이스 생길때마다 추가하든
        // 나중에 바꿀 수 있다.
        name: 'tab',
        keyPath: 'id', 
    },
    {   // [setting] 컬럼: id | openTabId
        name: 'settings',
        keyPath: 'id', // 1이 유일함.
    },
    {   // [log] 컬럼: timestamp | code | message
        name: 'log',
        keyPath: 'timestamp',
    },
    {
        // [assets] 컬럼: id | blob | filename | timestamp
        name: 'assets',
        keyPath: 'id',
    }
];