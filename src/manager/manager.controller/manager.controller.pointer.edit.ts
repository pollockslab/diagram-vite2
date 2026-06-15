import { _MNGR, _EDIT } from '@/main'
let t1 = 0;
export async function Down() {
    
}

export async function Drag() {

}

export async function Hover() {

}

export async function Up() {
}

export async function Click() {
    const down = _MNGR.controller.down;
    if(down.list.length > 0) {
        const diagram = down.list[down.list.length-1];
        _EDIT.Open(diagram);
    }
}