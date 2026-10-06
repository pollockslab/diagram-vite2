import { _VIEW, _SPCE, _MNGR } from '@/main'
import * as DiagramsType from '@/diagrams/diagrams.type'


export function Draw() {
    _VIEW.ClearRect();

    // [Background]
    _VIEW.background.Draw();

    // [Diagrams]
    const cellPoints = _MNGR.space_grid.GetCellPoints(_VIEW.GetRect());
    // const cellPoints = [[0, 0]];
    const cellDiagramsID = new Set<string>(); 
    for(const point of cellPoints) {
        // 포인트는 현재 보이는 화면 셀. 이것만 그리면 된다.
        // 이 포인트를 가지고 그릴 다이어그램 추려볼까.
        const grid = _SPCE.grid.Get(point); 
        if(!grid) {continue;}
        for(const GridListchildID of grid.list) {
            cellDiagramsID.add(GridListchildID);
        }
    }
    console.log('list: ', cellDiagramsID.values());
    // NOTE: 이제 정렬하자.

    // 객체 가져오자
    const diagrams1:DiagramsType.Instance[] = []; 
    for(const findID of cellDiagramsID) {
        const instance = _SPCE.diagrams.get(findID);
        if(!instance) {continue;}
        diagrams1.push(instance);
    }
    // 오래된 것부터 (오름차순)
    diagrams1.sort((a, b) => a.zIndex - b.zIndex);
    console.log('list2: ', diagrams1);


    // const diagrams = [..._SPCE.diagrams.values()];
    _VIEW.board.Draw(diagrams1);


    // [Effects]
    _VIEW.effect.AddSquare(0, 0, 100, 100, 'skyblue');
    _VIEW.effect.AddPoint(0, 0, 'green');
    _VIEW.effect.Draw();
}

// 분리를 해보자
