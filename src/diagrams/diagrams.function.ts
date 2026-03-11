
import * as DiagramsConst from './diagrams.const'
import * as DiagramsType from './diagrams.type'

export function GetClassByName(type: string): null | DiagramsType.Class {
    if (!(type in DiagramsConst.Class)) {return null;}
    return DiagramsConst.Class[type as DiagramsType.ClassName];
}


// function ResizeDiagram(xRange:number, yRange:number)
// {
//     const down: null|{x:number, y:number} = null;
//     if(down === null) return;

//     const size = new Map<string, number>();
//     // w, h 가 100 이하면 반려하자
//     switch (down.edge) 
//     {
//         case 'e': 
//             size.set('w', down.w + xRange);
//             break;
//         case 'w':
//             size.set('x', down.x + xRange);
//             size.set('w', down.w - xRange);
//             break;
//         case 's': 
//             size.set('h', down.h + yRange);
//             break;
//         case 'n':
//             size.set('y', down.y + yRange);
//             size.set('h', down.h - yRange);
//             break;
//         case 'es':
//             size.set('w', down.w + xRange);
//             size.set('h', down.h + yRange);
//             break; 
//         case 'wn':
//             size.set('x', down.x + xRange);
//             size.set('w', down.w - xRange);

//             size.set('y', down.y + yRange);
//             size.set('h', down.h - yRange);
//             break;
//         case 'en':
//             size.set('w', down.w + xRange);

//             size.set('y', down.y + yRange);
//             size.set('h', down.h - yRange);
//             break; 
//         case 'ws':
//             size.set('x', down.x + xRange);
//             size.set('w', down.w - xRange);

//             size.set('h', down.h + yRange);
//             break;
//     }

    
//     const sizeObj = Object.fromEntries(size);
//     if(sizeObj.w !== undefined && sizeObj.w <= 100) return;
//     if(sizeObj.h !== undefined && sizeObj.h <= 100) return;
//     if(sizeObj.w !== undefined && sizeObj.w >= 1000) return;
//     if(sizeObj.h !== undefined && sizeObj.h >= 1000) return;

//     const dTarget = down.target;
//     dTarget.SetData(sizeObj);
//     dTarget.Render();
// }



// function CheckCollisionEdge()
// {
//     const spaceX = _VIEW.SpaceX(this.move.x);
//     const spaceY = _VIEW.SpaceY(this.move.y);
//     const oldHover = _VIEW.status.hover;
//     const nowHover = _VIEW.GetCollisionChildPoint(spaceX, spaceY);
    
//     // hover 대상이 변경되었을 경우만 처리
//     if( nowHover !== oldHover ) {
//         _VIEW.status.hover = nowHover;
//     }

//     let cursorStyle = 'default';
//     if( nowHover !== null ) {
//         const edge = nowHover.GetCollisionEdge(spaceX, spaceY);
//         switch (edge) 
//         {
//             case 'e': 
//             case 'w':
//                 cursorStyle = 'ew-resize';
//                 break;
//             case 's': 
//             case 'n':
//                 cursorStyle = 'ns-resize';
//                 break;
//             case 'es': 
//             case 'wn':
//                 cursorStyle = 'nwse-resize';
//                 break;
//             case 'en': 
//             case 'ws':
//                 cursorStyle = 'nesw-resize';
//                 break;
//             default:
//                 cursorStyle = 'move';
//                 break;
//         }
//     }
//     // this.panel.style.setProperty('cursor', cursorStyle, 'important');
// }
