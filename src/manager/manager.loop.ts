import { _DPR, _VIEW, _CTRL, _REMO, _LOOP, _SPCE } from '@/main'

export const collision = {
    Hover: function(): void {
        
        // 1. 콜리전 체크
        // 2. 모서리 체크

        // 요것들 어디모듈에 붙일건지. 스페이스
        
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
