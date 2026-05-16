import { _DPR, _LOOP, _VIEW, _MNGR } from '../main'


export function Draw() {
    _LOOP.Command('render', 'draw', _MNGR.loop.render.Draw);
}

export function Resize() {
    _DPR.Update();
    _LOOP.Command('resize', 'resize', _MNGR.loop.render.Resize);
    _LOOP.Command('render', 'draw', _MNGR.loop.render.Draw);
}

export function Zoom(size: number) {
    _VIEW.zoom += size;
    _LOOP.Command('render', 'draw', _MNGR.loop.render.Draw);
}