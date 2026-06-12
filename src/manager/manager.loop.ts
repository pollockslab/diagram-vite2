import { _DPR, _VIEW, _CTRL, _REMO, _LOOP, _SPCE, _MNGR } from '@/main'
import * as Diagrams from '@/diagrams/diagrams'

export const collision = {
    Hover: function(): void {
        
        const moveX = _VIEW.SpaceX(_CTRL.move.offsetX);
        const moveY = _VIEW.SpaceY(_CTRL.move.offsetY);

        // [Grid] (x, y) 좌표에 있는 다이어그램 조회
        const point = _SPCE.collision.Point(moveX, moveY);
        if(point.length <= 0) {return;}
        
        // [Edge] 모서리 체크

        // [View] 보더 추가
        const front = point[point.length-1];
        if (front instanceof Diagrams.Class.Line) {
        }
        else if(front instanceof Diagrams.Class.Square) {
            _VIEW.effect.AddBorder(front.x, front.y, front.w, front.h, 'hotpink');
        }
        else if(front instanceof Diagrams.Class.Point) {
        }
    },
    
}
export const render = {
    Draw: function(): void {
        _VIEW.Draw();
    },
    Resize: function(): void {
        _VIEW.Resize();
    },
    // 사용처: multiselect, square, 그 외 범위설정 리모콘버튼
    Drag: function(): void {
        const downX = _VIEW.SpaceX(_CTRL.down.offsetX);
        const downY = _VIEW.SpaceY(_CTRL.down.offsetY);
        const moveX = _VIEW.SpaceX(_CTRL.move.offsetX);
        const moveY = _VIEW.SpaceY(_CTRL.move.offsetY);

        const x = Math.min(downX, moveX);
        const y = Math.min(downY, moveY);
        const w = Math.abs(moveX - downX);
        const h = Math.abs(moveY - downY);

        _VIEW.effect.AddSquare(x, y, w, h, 'rgba(59, 130, 246, 0.15)');
        _VIEW.effect.AddBorder(x, y, w, h, 'rgba(59, 130, 246, 1)');
        
        _VIEW.Draw();
    }
}
