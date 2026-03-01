import {type _DT} from '../diagrams/diagrams.type'

export namespace _TT
{
    export interface ICommand {
        commandID: string,
        mementos: IMemento[],
    }
    export interface IMemento {
        old: _DT.CHILD_OBJECT | null,
        now: _DT.CHILD_OBJECT | null,
    }
}