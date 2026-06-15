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
    // 배경클릭이면 부모로 한단계 오르기
    // 사각형 클릭이면 사각형 들어가자
    // console.log(down);
    if(Date.now()-t1 < 200) {
        console.log('더블클릭');
    }
    t1 = Date.now();
    // _EDIT.Open();
}
// Dblclick() {
// }
// 우클릭은