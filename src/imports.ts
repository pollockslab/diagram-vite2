
// diagrams
import {_MAIN as _AXIS} from './diagrams/axis'
import {_MAIN as _SQUARE} from './diagrams/square'
export const _DIAGRAM = {
  axis: _AXIS,
  square: _SQUARE,
}

export function generateUUID() 
{
  // 1. 최신 환경 (가장 빠르고 안전)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // 2. fallback: RFC 4122 v4
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);

    // version (4)
    buf[6] = (buf[6] & 0x0f) | 0x40;
    // variant (RFC 4122)
    buf[8] = (buf[8] & 0x3f) | 0x80;

    let i = 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const v = buf[i++] & 0x0f;
      return (c === 'x' ? v : (v & 0x3) | 0x8).toString(16);
    });
  }

  // 3. 최후의 보루 (거의 안 타지만)
  return (
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).slice(2, 10)
  );
}