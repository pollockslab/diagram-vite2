

export type Action = 'Dummy' | 'Pointer' | 'Multiselect';

export type Call = (...args: any[]) => void;

export type CommandKey = keyof Command;
export interface Command {
    resize      : Map<string, Call>;
    collision   : Map<string, Call>;
    action      : Map<string, Call>;
    storage     : Map<string, Call>;
    render      : Map<string, Call>;
}

export type FPSKey = keyof FPSConfig;
export interface FPSConfig {
    Hz30    : number;
    Hz60    : number;
    Hz120   : number;
    Hz144   : number;
    Hz240   : number;
}