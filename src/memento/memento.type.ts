
import * as DiagramsType from '@/diagrams/diagrams.type'


export interface Memento {
    command : Command;
    list    : work[];
}
export type Command = 'diagram' | 'space-move';
export interface work {
    before: DiagramsType.serialize.Union | null,
    after : DiagramsType.serialize.Union | null,
}