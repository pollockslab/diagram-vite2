
import { _DPR } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'
import { Point } from '@/diagrams/core/point'

export class Pin extends Point implements DiagramsType.serialize.modules.point.Pin {
    pin = {
        backgroundColor : 'orange',
        text            : '',
    };

    constructor() {
        super();
        this.axis.type = 'Pin';
    }

    get serialize(): DiagramsType.serialize.modules.point.Pin {
        return {
            ...super.serialize,
            pin: {
                backgroundColor : this.pin.backgroundColor,
                text            : this.pin.text,
            },
        };
    }

    // Snapshot() {
    //     ////////////
    //     const metrics = ctx.measureText("Pollock");
    //     const textWidth = metrics.width; // 텍스트의 가로 길이
    //     const textHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    // }
}
