import * as LoopType from './loop.type'
import { _VIEW, _REMO, _TRAN, _CTRL } from '@/main';

// [Option] Loop의(rAF) 동작 속도를 제한하기 위한 주사율 변수.
// (※ 뺄셈값은 주사율을 넘으면 프레임을 건너 뛸 수 있어 적용한 보정값.)
const _FPS: LoopType.FPSConfig = {
    Hz30  : 1000/30  - 0.8, // 33.33 - 0.8
    Hz60  : 1000/60  - 0.8, // 16.66 - 0.8
    Hz120 : 1000/120 - 0.5, // 8.33  - 0.5
    Hz144 : 1000/144 - 0.5, // 6.94  - 0.5
    Hz240 : 1000/240 - 0.3, // 4.16  - 0.3
};

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
        lastTime: 0 as number,
        fps: 'Hz60' as LoopType.FPSKey,
    };

    constructor() {
        this.Loop(0);
    }
    private Loop = (currentTime: number) => {
        const deltaTime = currentTime - this.status.lastTime;
        if(deltaTime > _FPS[this.status.fps]) {
            this.status.lastTime = currentTime;
            this[this.remocon]();
        }
        requestAnimationFrame(this.Loop);
    }
    
    get fps() {
        return this.status.fps;
    }
    set fps(Hz: LoopType.FPSKey) {
        this.status.fps = Hz;
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
    private Calls(mapKeys: LoopType.CommandKey[]) {
        for(const mapKey of mapKeys) {
            const map = this.command[mapKey];
            if(map.size > 0) {
                map.forEach(call => call());
            }
            map.clear();
        }
    }

    private Dummy () {
        // 1. [Convert] 필요한 스케줄 추가
        // _TRAN.render.Draw();

        // 2. [Call] 예악작업 호출 후 제거
        // this.Calls(['resize', 'collision', 'render']);
    }
  
    private Pointer() {
        this.Calls(['resize', 'collision', 'render']);
    }

    private Multiselect() {

    }
}