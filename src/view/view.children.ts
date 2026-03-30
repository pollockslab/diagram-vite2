import { Grid } from './grid'

export class ViewChildren {

    children = {
        Axis:   [],
        Line:   [],
        Square: [],
        Point:  [],
        Button: [],
    };

       /** 
         * [Optimize] Grid
         * 수천 개의 다이어그램을 전부 조사하지 않기 위한 공간 분할 격자입니다.
         * 마우스 좌표(x,y)에 위치한 특정 Grid 셀(예: 100x100) 주변만 검사하여 
         * Collision(충돌) 함수 호출을 줄였습니다.
         */
        grid = new Grid();

    constructor() {

    }


}