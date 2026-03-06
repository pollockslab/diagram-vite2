import { type _LT } from './loop.type'
import { _VIEW, _REMO } from '../main';

export class _MAIN {

    private tasks = {
        type: Function,
        // collision 체크한게 들어가야될거같은데. 
        // 타입마다 콜리전체크를 안하기도 할텐데
    };
    isDraw = false;

    constructor() {

        this.Loop();


        /**
         * 1. 기본체크
         *  - collision mouse
         *  - collision group
         *  - view.hover
         *  - view.draw
         * 
         */


    }
    // 호출하는쪽에서
    // loop.isDraw = true; 식으로 하고 말면 편하긴 함
    // 근데 여건상 함수단위고 이마저도 내용물이 바뀌니까.
    // 플래그도 함수형태로 받아서 루프 내부에서 알아서 현재 진행중인 함수에
    // 넣어주고, 지금 진행되는게 아니면 무시해야돼
    // 무시를 해도 될까? 저장인데 화면에는 안보이는데 storage 만 저장될 상황 나올듯

    Loop = () => {
        
        // 1. view.draw
        // 2. view.hover : 마우스 움직일때 체크 -> 루프때 체크
        // 3. collision 체크 : 마우스랑
        // 4. collision 체크 : 그룹은 사각형끼리
        // 5. 
        
        // tran 에서 루프로 추가할 일이 있을까?

        
        requestAnimationFrame(this.Loop);
    }

    _POINTER()
    {
        const nextTask = 'default';// 1회만에 끝마치고 기본으로 갈껀지를 코등해야해

        if(this.isDraw === true) {_VIEW.Draw();}   

    }


}