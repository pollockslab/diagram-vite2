import * as ManagerController   from './manager.controller'
import * as ManagerRemocon      from './manager.remocon'
import * as ManagerRender       from './manager.render'
import * as ManagerLoop         from './manager.loop'
import * as ManagerStorage      from './manager.storage'
import * as ManagerDiagram      from './manager.diagram'
import * as ManagerSettings     from './manager.settings'
import * as ManagerSpace     from './manager.space'


// 실시간으로 프로그램 상태를 확인
export class Manager {
    controller  = ManagerController;
    remocon     = ManagerRemocon;
    render      = ManagerRender;
    loop        = ManagerLoop;
    storage     = ManagerStorage;
    diagram     = ManagerDiagram;
    settings    = ManagerSettings;
    space       = ManagerSpace;

    constructor() {}
}