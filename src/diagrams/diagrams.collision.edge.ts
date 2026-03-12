import { Axis } from './axis'

export function GetCollisionEdge(x:number, y:number): DiagramsType.Edge
{
    if(!this.IsCollisionPoint(x, y)) {return null;}
    
    const lineWidth = 10;

    const left      = this.x;
    const right     = this.x + this.w;
    const top       = this.y;
    const bottom    = this.y + this.h;
    
    let arrow = '';

    if      (Math.abs(x - right)  <= lineWidth) arrow += 'e';
    else if (Math.abs(x - left)   <= lineWidth) arrow += 'w';
    if      (Math.abs(y - bottom) <= lineWidth) arrow += 's';
    else if (Math.abs(y - top)    <= lineWidth) arrow += 'n';

    return (arrow || null) as DiagramsType.Edge;
}