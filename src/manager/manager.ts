import * as ManagerController from './manager.controller'
import * as ManagerRemocon from './manager.remocon'
import * as ManagerRender from './manager.render'
import * as ManagerLoop from './manager.loop'
import * as ManagerStorage from './manager.storage'


// 실시간으로 프로그램 상태를 확인
export class Manager {
    controller = ManagerController;
    remocon = ManagerRemocon;
    render = ManagerRender;
    loop = ManagerLoop;
    storage = ManagerStorage;

    constructor() {
        // 1. 호출받아서 한다
        // 2. 여기서 옵저버 형식으로 체크한다

        // 매니저에서 확인이 필요한 동작만 함수로 만들어보자.
    }
    
 
}