import { _DPR, _LOOP, _VIEW } from '../main'


export function Draw() {
    _LOOP.Command('render', 'draw', () => {
        _VIEW.Draw();
    });
}

export function Resize() {
    _DPR.Update();
    _LOOP.Command('resize', 'resize', () => {
        _VIEW.Resize();
    });

    _LOOP.Command('render', 'draw', () => {
        _VIEW.Draw();
    });
}

export function Zoom(size: number) {
    _VIEW.zoom += size;
    _LOOP.Command('render', 'draw', () => {
        _VIEW.Draw();
    });
}
