// NOTE: 문서 `/readme/spec/schema.md` 참조.

export const objectStores = [
    {
        name: 'diagram',
        keyPath: 'axis.id',
        indexList: [
            { name: 'type'            , keyPath: 'axis.type'         },
            { name: 'zIndex'          , keyPath: 'axis.zIndex'       },
            { name: 'parentDiagramID' , keyPath: 'parent.diagram.id' },
        ],
    },
    {
        name: 'space_grid',
        keyPath: 'space_grid.id',
        indexList: [
            { name: 'grid', keyPath: ['space_grid.x1000', 'space_grid.y1000', 'self.diagram.id'] },
        ],
    },
    {
        name: 'tab',
        keyPath: 'tab.id',
        indexList: [], 
    },
    {
        name: 'tab_memento',
        keyPath: 'tab_memento.id',
        indexList: [], 
    },
    {
        name: 'settings',
        keyPath: 'settings.id', // 1이 유일함.
        indexList: [],
    },
    { 
        name: 'log',
        keyPath: 'log.timestamp',
        indexList: [],
    },
    {
        name: 'assets',
        keyPath: 'assets.id',
        indexList: [],
    }
];