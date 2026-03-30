
// [Core]
import { Axis } from '@/diagrams/core/axis'
import { Line } from '@diagrams/core/line'
import { Point } from '@diagrams/core/point'
import { Square } from '@diagrams/core/square'

// [Modules][Bottun]
import { Action } from '@diagrams/modules/button/action'

// [Modules][Line]
import { Link } from '@diagrams/modules/line/link'
import { Arrow } from '@diagrams/modules/line/arrow'

// [Modules][Point]
import { Pin } from '@diagrams/modules/point/pin'

// [Modules][Square]
import { Drawmap } from '@diagrams/modules/square/drawmap'
import { Group } from '@diagrams/modules/square/group'
import { Memo } from '@diagrams/modules/square/memo'





export const Class = {
    // [Core]
    Axis, Line, Point, Square,

    // [Modules][Bottun]
    Action,

    // [Modules][Line]
    Link, Arrow,

    // [Modules][Point]
    Pin, 
    
    // [Modules][Square]
    Drawmap, Group, Memo,

} as const;


export const Edge = [null,'e','w','s','n','es','en','ws','wn'] as const;


