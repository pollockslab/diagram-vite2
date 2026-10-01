import * as Diagrams from './diagrams'

export type ID          = null | string;
export type ClassName   = keyof typeof Diagrams.Class;
export type Instance    = InstanceType< typeof Diagrams.Class[ClassName] >;


// [Schema] Storage 저장용 인터페이스.(IndexedDB 에 넣을 데이터 형태.)
export namespace serialize {
    // ※ 모든 다이어그램들의 최상위 공통 속성들.
    export namespace core {  
        export interface Axis {
            axis: {
                id      : ID,
                zIndex  : number,
                version : number,
            },
            type: ClassName,
            parent: {
                diagram: {
                    id: ID,
                },
                tab: {
                    id: ID,
                },
            },
        }
        export interface Chain extends serialize.core.Axis{
            chain: {
                diagram1: {
                    id: ID,
                    x : number,
                    y : number,
                },
                diagram2: {
                    id: ID,
                    x : number,
                    y : number,
                },
            },
        }
        // [FIXME] 이럴꺼면 포인트 기준으로 다각형 형태 사각형도 4point 낫지않나
        export interface Line extends serialize.core.Axis{
            line: {
                x1: number,
                y1: number,
                x2: number,
                y2: number,
            },
        }
        export interface Point extends serialize.core.Axis{
            point: {
                x       : number,
                y       : number,
            },
        }
        export interface Rect extends serialize.core.Axis{
            rect: {
                x       : number,
                y       : number,
                width   : number,
                height  : number,
            },
        }
    }
    // ※ 비즈니스 모듈 데이터.
    export namespace modules {
        // [Button]
        export namespace button {
            export interface Action extends serialize.core.Rect{
                action: {
                    backgroundColor : string,
                    text            : string,
                    call            : string,
                    imageSrc        : string,
                },
            }
        }
        // [Line]
        export namespace line {
            export interface Link extends serialize.core.Line{
                link: {
                    backgroundColor : string,
                    text            : string,
                },
                
            }
            export interface Arrow extends serialize.core.Line{
                arrow: {
                    backgroundColor : string,
                    text            : string,
                },
                
            }
        }
        // [Point]
        export namespace point {
            export interface Pin extends serialize.core.Point{
                pin: {
                    backgroundColor : string,
                    text            : string,
                },
            }
        }
        // [Rect]
        export namespace rect {
            export interface Memo extends serialize.core.Rect{
                memo: {
                    backgroundColor : string,
                    text            : string,
                },
            }
            export interface Group extends serialize.core.Rect{
                group: {
                    backgroundColor : string,
                    text            : string,
                },
            }
            export interface Drawmap extends serialize.core.Rect{
                drawmap: {
                    backgroundColor : string,
                    text            : string,
                },
            }
        }
    }
    export type Union = 
        // [Core]
          serialize.core.Axis 
        | serialize.core.Line
        | serialize.core.Point
        | serialize.core.Rect

        // [Button]
        | serialize.modules.button.Action

        // [Line]
        | serialize.modules.line.Arrow
        | serialize.modules.line.Link

        // [Point]
        | serialize.modules.point.Pin

        // [Rect]
        | serialize.modules.rect.Drawmap
        | serialize.modules.rect.Group
        | serialize.modules.rect.Memo;
}



