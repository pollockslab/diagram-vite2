import * as Diagrams from './diagrams'


export type Edge        = typeof Diagrams.Edge[number];

export type ClassName   = keyof typeof Diagrams.Class;
export type Instance    = InstanceType< typeof Diagrams.Class[ClassName] >;
// export type Children    = { [key in ClassName]: Instance[]; }

// [Schema] Storage 저장용 인터페이스.(IndexedDB 에 넣을 데이터 형태.)
export namespace serialize {
    export namespace core {
        // ※ 모든 다이어그램의 최상위 공통 속성
        export interface Axis {
            tab: {
                id: string | null,
            },
            parent: {
                id: string | null,
            },
            axis: {
                type    : ClassName,
                id      : string | null,
                zIndex  : number | null,
            },
        }
        export interface Line extends serialize.core.Axis{
            line: {
                x1       : number,
                y1       : number,
                x2       : number,
                y2       : number,
            },
        }
        export interface Point extends serialize.core.Axis{
            point: {
                x       : number,
                y       : number,
            },
        }
        export interface Square extends serialize.core.Axis{
            square: {
                x       : number,
                y       : number,
                w       : number,
                h       : number,
            },
        }
    }
    // ※ 비즈니스 모듈 데이터.
    export namespace modules {
        // [Button]
        export namespace button {
            export interface Action extends serialize.core.Square{
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
        // [Square]
        export namespace square {
            export interface Memo extends serialize.core.Square{
                memo: {
                    backgroundColor : string,
                    text            : string,
                },
            }
            export interface Group extends serialize.core.Square{
                group: {
                    backgroundColor : string,
                    text            : string,
                },
            }
            export interface Drawmap extends serialize.core.Square{
                drawmap: {
                    backgroundColor : string,
                    text            : string,
                },
            }
        }
    }
}



