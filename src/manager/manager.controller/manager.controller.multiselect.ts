import { _LOOP, _MNGR } from '@/main'

export async function Down() {
    console.log('hi!')
}

export async function Drag() {
    _LOOP.Command('render', 'drag-square', _MNGR.loop.render.Drag);
    _MNGR.render.Draw();
}

export async function Hover() {
    _LOOP.Command('collision', 'hover', _MNGR.loop.collision.Hover);
    _MNGR.render.Draw();
}

export async function Up() {
    console.log('up')
}

export async function Click() {
    console.log('d click!')
}