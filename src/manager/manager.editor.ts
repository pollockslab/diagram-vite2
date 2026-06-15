import { _MNGR, _EDIT } from '@/main';
import * as Diagrams from '@/diagrams/diagrams'
import * as DiagramsType from '@/diagrams/diagrams.type'

export function Open(diagram: DiagramsType.Instance) {

    if (diagram instanceof Diagrams.Class.Line) {
    }
    else if(diagram instanceof Diagrams.Class.Square) {
        
        _EDIT.Open(); // 편집기를 열지, 스페이스를 열지
        
    }
    else if(diagram instanceof Diagrams.Class.Point) {
    }


}

export function Close() {
}