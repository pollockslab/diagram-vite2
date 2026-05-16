
export type ButtonType = 'passive'|'active'|'toggle';
export interface ButtonInfo {
    id      : string;
    button  : HTMLElement;
    type    : ButtonType;
    title   : string;
}
