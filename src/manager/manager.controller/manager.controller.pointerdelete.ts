import { _MNGR } from '@/main'

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
        console.log(diagram)
        await _MNGR.diagram.Delete(diagram);
        _MNGR.render.Draw();
    }
}