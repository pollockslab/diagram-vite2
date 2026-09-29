
import * as DiagramsType from '@/diagrams/diagrams.type'

export type ID = null | string;
export interface TabMemento {
    tab_memento: {
        id      : ID;
        history : History[];
        nowOrder: number;
    };
}

export interface History {
    command : Command;
    works   : work[];
}
export type Command = 'diagram' | 'space-move';
export interface work {
    before: DiagramsType.serialize.Union | null,
    after : DiagramsType.serialize.Union | null,
}

