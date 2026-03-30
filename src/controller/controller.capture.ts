import { _VIEW, _TRAN } from '@/main'
import * as DiagramsType from '@diagrams/diagrams.type'


export class Down {

    instance: DiagramsType.Instance | null = null;
    private serialize: any;
    edge: DiagramsType.Edge | null = null;

    constructor() {}
    
    Capture(offsetX: number, offsetY: number) {
        const spaceX = _VIEW.SpaceX(offsetX);
        const spaceY = _VIEW.SpaceY(offsetY);


        const collisionTarget = _TRAN.collision.point.FindFront(_VIEW, spaceX, spaceY) ?? _VIEW;
        let edge: DiagramsType.Edge | null = null;

        if(collisionTarget !== _VIEW) {
            // [Convert] 클릭한 다이어그램 최상단으로 올리기
            _TRAN.action.MoveFront(_VIEW, collisionTarget);
            edge = _TRAN.collision.edge.Check(collisionTarget, spaceX, spaceY);
        
        }



        // 캡처 시켰으니까 
    }

    // 이렇게 따로 떨어트리면 안될거같아 한꺼번에 가져가야되나 판단해보자.
    // 제일 좋은건 부르는쪽에서 판단이 되고 여기서도 매번 캡처된게 맞나 확인 없는게 맞는건가
    // 둘이 굳이 비교를 없애면 컨트롤러는 모르고 여기서 비교해주는게 맞지

    get type() {
        return this.serialize.type ?? null;
    }
}

export class Hover {

    target: DiagramsType.Instance | null = null;
    edge: DiagramsType.Edge | null = null;
    offsetX: number = 0;
    offsetY: number = 0;

    constructor() {}
}

export class Select {

    targets: DiagramsType.Instance[] = [];

    constructor() {}

    Init(): void {
        this.targets = [];
    }

    Set(arr: DiagramsType.Instance[]): void {
        this.targets.push(...arr);
    }
}
