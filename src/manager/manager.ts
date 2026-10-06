import * as ManagerMain         from './manager.main'
import * as ManagerController   from './manager.controller/manager.controller'
import * as ManagerRemocon      from './manager.remocon'
import * as ManagerRender       from './manager.render'
import * as ManagerLoop         from './manager.loop'
import * as ManagerDiagram      from './manager.diagram/manager.diagram'
import * as ManagerSettings     from './manager.settings'
import * as ManagerSpace        from './manager.space/manager.space'
import * as ManagerSpaceGrid    from './manager.space/manager.space.grid'
import * as ManagerTabMemento   from './manager.tab_memento'
import * as ManagerTab          from './manager.tab'
import * as ManagerCollision    from './manager.collision/manager.collision'
import * as ManagerView         from './manager.view'


// 실시간으로 프로그램 상태를 확인
export class Manager {
    main        = ManagerMain;
    controller  = ManagerController;
    remocon     = ManagerRemocon;
    render      = ManagerRender;
    loop        = ManagerLoop;
    diagram     = ManagerDiagram;
    settings    = ManagerSettings;
    space       = ManagerSpace;
    space_grid  = ManagerSpaceGrid;
    tab_memento = ManagerTabMemento;
    tab         = ManagerTab;
    collision   = ManagerCollision;
    view        = ManagerView;

    constructor() {}
}