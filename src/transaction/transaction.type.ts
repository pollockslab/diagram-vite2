import * as DiagramsType from '../diagrams/diagrams.type'

export interface Command {
    commandID: string,
    mementos: Memento[],
}
export interface Memento {
    old: DiagramsType.Instance | null,
    now: DiagramsType.Instance | null,
}

