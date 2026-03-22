import * as LoopType from './loop.type'
import { _VIEW, _REMO, _TRAN, _CTRL } from '@/main';

export class Loop {

    private command: LoopType.Command = {
        resize      : new Map<string, LoopType.Call>(),
        collision   : new Map<string, LoopType.Call>(), 
        action      : new Map<string, LoopType.Call>(),
        storage     : new Map<string, LoopType.Call>(),
        render      : new Map<string, LoopType.Call>(),
    };
    private status = {
        remocon: 'Dummy' as LoopType.Action,
    };

    constructor() {
        this.Loop();
    }
    private Loop = () => {
        this[this.remocon]();
        requestAnimationFrame(this.Loop);
    }

    get remocon() {
        return this.status.remocon;
    }
    set remocon(type: LoopType.Action) {
        if(type === this.remocon) {return;}

        // [Init] 작업스케줄 초기화
        Object.values(this.command).forEach(map => map.clear());

        // [Update] 기본 순환스케줄 변경
        this.status.remocon = type;
    }
    Command(layerKey: LoopType.CommandKey, mapKey: string, call: LoopType.Call) {
        this.command[layerKey].set(mapKey, call);
    }
   
    private Dummy () {}
    private Pointer() {
        // [Convert] 필요한 스케줄 추가
        // this.block.IsHover();
        _TRAN.render.Draw();

        // [Call] 예악작업 호출 후 제거
        const mapKeys: LoopType.CommandKey[] = ['resize', 'collision', 'render'];
        for(const mapKey of mapKeys) {
            const map = this.command[mapKey];
            if(map.size > 0) {
                map.forEach(call => call());
            }
            map.clear();
        }
    }

    private Multiselect() {

    }
}