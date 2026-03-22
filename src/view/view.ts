
import { _CTRL, _DPR } from '../main'
import { Diagrams } from '../diagrams/diagrams'
import { Axis } from '../diagrams/modules/axis'
import { Grid } from './grid'
import { ViewBackground } from './view.background'
import { ViewBoard } from './view.board'
import { ViewEffect } from './view.effect'
import './view.css'


export class View extends Axis
{
    panel: HTMLDivElement;
    scope = {
        w: 0, 
        h: 0,
        zoom: {
            size: 1,
            min : 0.5, 
            max : 2,
        },
    };

    /** 
     * [Optimize] Grid
     * 수천 개의 다이어그램을 전부 조사하지 않기 위한 공간 분할 격자입니다.
     * 마우스 좌표(x,y)에 위치한 특정 Grid 셀(예: 100x100) 주변만 검사하여 
     * Collision(충돌) 함수 호출을 줄였습니다.
     */
    grid = new Grid();

    background  : ViewBackground;
    board       : ViewBoard;
    effect      : ViewEffect;
    
    constructor(args: {parentNode: HTMLDivElement}) {
        super();
        
        // [Cover] 배경 담을 div 생성
        this.panel = document.createElement('div');
        this.panel.id = 'view';
        args.parentNode.appendChild(this.panel);

        // [Create] 배경 순차적 생성. (1. Background, 2. Board, 3. Effect)
        this.background = new ViewBackground({parentNode: this.panel});
        this.board      = new ViewBoard     ({parentNode: this.panel});
        this.effect     = new ViewEffect    ({parentNode: this.panel});

        // [Resize] 배경 생성직후, 캔버스 초기화 위해 호출.
        this.Resize();
    }
    
    get zoom() {
        return this.scope.zoom.size;
    }
    set zoom(size) {
        const zoom = this.scope.zoom;
        if(size >= zoom.min && size <= zoom.max) {
            zoom.size = size;
        }
    }

    Resize() {
        const width  = this.panel.offsetWidth;
        const height = this.panel.offsetHeight;
        this.scope.w = width;
        this.scope.h = height;

        this.background.Resize(width, height);
        this.board     .Resize(width, height);
        this.effect    .Resize(width, height);
    }

    SpaceX(offsetX: number): number {
        return Math.round((offsetX-(this.scope.w/2))/this.zoom + this.x);
    }

    SpaceY(offsetY: number): number {
        return Math.round((offsetY-(this.scope.h/2))/this.zoom + this.y);
    }

    SpaceLine(pixel:number): number {
        return Math.round(pixel/this.zoom);
    }

    // !!! 정리 후에 데이터 불러오기 테스트때 고치자
    async LoadMap(tabID:string) {
        this.tab.id = tabID; 
        
        // 탭에 대한걸 로드할지 다이어그램 아이디로 로드해야될지
        this.children = {
            axis: [],
            square: [],
        };

        // 생성순서가 있으니 순서대로 하는게 맞을거같아
        const inst1 = Diagrams.children.Add(this, {
            axis: {type:'square', id:'fir1', x:-300, y: 0, w:200, h:200,}, 
            square: {backgroundColor:'blue', text:'글입히자'},
        });

         const inst2 = Diagrams.children.Add(this, {
            axis: {type:'square', id:'fir2', x:110, y: 0, w:200, h:200,}, 
            square: {backgroundColor:'blue', text:'글입히자'},
        });

        // let cnt = 0;
        // for(let col=-5; col<5; col++) {
        //     for(let row=-5; row<5; row++) {
        //         Diagrams.children.Add(this, {
        //             axis: {type:'square', id:`id${col}_${row}`, x:110*col, y: 110*row, w:100, h:100, zIndex:cnt++}, 
        //             square: {backgroundColor:`rgb(${col*20+100},${col*20+100},${row*20+100})`, text:`${col}_${row}`},
        //         });
        //     }
            
        // }
        
    }

    Draw() {
        // !!!!!!! controller 에서 command 로 Move 보내는 형식으로 바꾼 이후에
        // 여기서 직접 Update 호출부분 삭제필요.

        // [Background]
        this.background.Update(this.x, this.y, this.zoom);
        this.background.Draw();

        // [Board]
        this.board.Update(this.x, this.y, this.zoom);
        this.board.Draw(this.x, this.y, Diagrams.children.GetListAll(this));

        // [Effect]
        this.effect.Update(this.x, this.y, this.zoom);
        this.effect.Draw(this.x, this.y);
    }

}