import { _VIEW, _REMO, _LOOP } from '../main';

/**
 * 메멘토 없음. 없을을 어떻게 주석에 보여줄까
 * @param size Zoom 크기(감소/증가)
 */
export function SetZoom(size: number) {
    _VIEW.zoom += size;
    _LOOP.isDraw = true;
}
