
export interface ControllerAction {
    Down?   : () => Promise<void>;
    Drag?   : () => Promise<void>;
    Hover?  : () => Promise<void>;
    Up?     : () => Promise<void>;
    Click?  : () => Promise<void>;
}
