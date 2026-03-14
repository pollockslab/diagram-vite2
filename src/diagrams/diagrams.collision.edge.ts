
import * as DiagramsType from './diagrams.type'
import * as DiagramsCollisionPoint from './diagrams.collision.point'

export function Check(target: DiagramsType.Instance, x:number, y:number): DiagramsType.Edge {
    if(!DiagramsCollisionPoint.Check(target, x, y)) {return null;}
    
    const lineWidth = 10;

    const left      = target.x;
    const right     = target.x + target.w;
    const top       = target.y;
    const bottom    = target.y + target.h;
    
    let arrow = '';

    if      (Math.abs(x - right)  <= lineWidth) arrow += 'e';
    else if (Math.abs(x - left)   <= lineWidth) arrow += 'w';
    if      (Math.abs(y - bottom) <= lineWidth) arrow += 's';
    else if (Math.abs(y - top)    <= lineWidth) arrow += 'n';

    return (arrow || null) as DiagramsType.Edge;
}