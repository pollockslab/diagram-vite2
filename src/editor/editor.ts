import { _VIEW, _REMO, _LOOP, _SPCE, _STOR, _MNGR } from '../main'
import * as Diagrams from '@/diagrams/diagrams'
import * as DiagramsType from '@/diagrams/diagrams.type'

import { EditorSquare } from './editor.square/editor.square'


export class Editor {
    ui: {
        square: EditorSquare,
    };   

    constructor(args: {parentNode: HTMLElement}) {
        this.ui = {
            square: new EditorSquare({parentNode: args.parentNode}),
        };
    }

    Open(diagram: DiagramsType.Instance) {
        if (diagram instanceof Diagrams.Class.Line) {
        }
        else if(diagram instanceof Diagrams.Class.Square) {
            this.ui.square.Open(diagram);
        }
        else if(diagram instanceof Diagrams.Class.Point) {
        }

        
    }
    Close() {
        // 저장할지, 그냥 끌지. 더티플래그 확인 후
        // _MNGR.diagram.UpdateBySerialize()
    }
}