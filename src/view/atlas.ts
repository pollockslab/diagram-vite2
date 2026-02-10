
import { _DIAGRAM } from '../imports'
import { _VIEW } from '../main';
import { type TDiagram } from '../diagrams/axis'


type TSlot = 'small'|'large'|'temp';
type TDiagramID = string|null;
interface IAtlasMap {
    cav: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    type: TSlot,
    slots: Array<string|null>
}

const _DPR = Math.round(window.devicePixelRatio) || 1;

export class _MAIN
{
    
    n1:number = 0;
    info = {
        cutSize: 500,
        small: {
            w: 2048,
            h: 2048,
            slotSize: 512,
            slotCount: 16,
        },
        large: {
            w: 2048,
            h: 2048,
            slotSize: 1024,
            slotCount: 4,
        },
        temp: {
            w: 1024,
            h: 1024,
            slotSize: 1024,
            slotCount: 1,
        }
    }
    maps = {
        small: [this.CreateMap('small')] as Array<IAtlasMap>,
        large: [this.CreateMap('large')] as Array<IAtlasMap>,
        temp : this.CreateMap('temp'),
    }

    constructor()
    {
    }

    // 다이어그램 뷰 로드시 호출
    LinkDiagrams()
    {
        // 1. 슬롯분배 초기화
        ['large', 'small'].forEach(type => {
            this.maps[type as 'large'|'small'].forEach(map => {
                const info = this.info[map.type];
                map.slots = new Array(info.slotCount).fill(null);
                console.log(map.slots)
            });
        });
        
        // 2. 다이어그램 가져오기
        const allChildren = _VIEW.GetAllChildren();
        if(allChildren.length <= 0) return;
        
        // 3. 분배용 임시 저장소
        const devide = { large: [] as TDiagramID[], small: [] as TDiagramID[] }
        const pushCnt = { large: 0, small: 0 };
        
        // 3. 메인 루프: 자식들을 순회하며 상자에 담기
        for (const diagram of allChildren) {
            const mapType = this.CheckMapType(diagram);
            devide[mapType].push(diagram.id);
            const info = this.info[mapType];

            // 상자가 꽉 찼을 때만 맵에 배정
            if (devide[mapType].length === info.slotCount) {
                this.SetSlotsMap(mapType, devide[mapType], pushCnt[mapType]);
                devide[mapType] = []; // 새 빈 상자로 교체 (참조 끊기)
            }

            // 다이어그램에 슬롯정보 전달
            this.SendSlotDiagram(diagram, mapType, pushCnt[mapType]);
            
            pushCnt[mapType]++;
        }

        // 4. 잔여물 처리
        ['large', 'small'].forEach(type => {
            const t = type as 'large'|'small';
            if (devide[t].length > 0) {
                this.SetSlotsMap(t, devide[t], pushCnt[t]);
            }
        });

    }

    private SendSlotDiagram(diagram: TDiagram, type: 'large'|'small', count: number)
    {
        // 1. 아틀라스배열중 슬롯중에 id 들어간 위치
        // 2. 캔버스 x 좌표
        // 3. 캔버스 y 좌표
        const info = this.info[type];
        const cols = Math.trunc(info.w/info.slotSize);
        const col = count%cols;
        const row = Math.trunc(count/cols);

        const x:number = col*info.slotSize;
        const y:number = row*info.slotSize;
        const mapOrder = Math.trunc(count / info.slotCount); // 몇 번째 맵인지 계산
        const map = this.maps[type][mapOrder];
        
        const capture = {
            cav: map.cav,
            ctx: map.ctx,
            x: x,
            y: y
        };
        console.log(x, y, count)
        diagram.SetCapture(capture);
    }

    // 맵을 찾거나 생성해서 슬롯을 할당하는 공통 로직 (중복 제거)
    private SetSlotsMap(type:'large'|'small', slots: TDiagramID[], count: number) 
    {
        const info = this.info[type];
        const mapOrder = Math.ceil(count / info.slotCount); // 몇 번째 맵인지 계산

        // 맵이 모자라면 새로 생성
        if (mapOrder > this.maps[type].length) {
            this.maps[type].push(this.CreateMap(type));
        }

        // 해당 맵에 슬롯 뭉치 전달
        const mapTarget = this.maps[type][mapOrder - 1];
        for(let i=0; i<slots.length; i++) {
            mapTarget.slots[i] = slots[i];
        }              
    }

    CheckMapType(diagram: TDiagram): 'large'|'small'
    {
        const cutSize = this.info.cutSize; 
        return (diagram.w > cutSize || diagram.h > cutSize)? 'large':'small';
    }
    
    InsertSlot(diagram: TDiagram)
    {
        const mapType =this.CheckMapType(diagram);
        for(const map of this.maps[mapType]) {
            for(let i=0; i<map.slots.length; i++) {
                if(map.slots[i] === null) {
                    map.slots[i] = diagram.id;
                    // 다이어그램에 슬롯정보 전달
                    this.SendSlotDiagram(diagram, mapType, i);
                    return;
                }
                
            }
        }
        console.log('dusss')

        // 슬롯이 꽉 찼으니 맵 추가후 슬롯에 id 추가
        const map = this.CreateMap(mapType);
        map.slots[0] = diagram.id;
        const iPush = this.maps[mapType].push(map) -1;
        const info = this.info[mapType];
        const iSend = info.slotCount*iPush;
        this.SendSlotDiagram(diagram, mapType, iSend);
    }
    
    private CreateMap(type:TSlot): IAtlasMap
    {
        // 정보 가져오기
        const info = this.info[type];

        // 타일 설정
        const cols = Math.trunc(info.w/info.slotSize);
        const rows = Math.trunc(info.h/info.slotSize);
        const slots = new Array(cols*rows).fill(null);
        
        // 캔버스 설정
        const cav = document.createElement('canvas');
        cav.width = info.w * _DPR;
        cav.height = info.h * _DPR;
        const ctx = cav.getContext('2d') as CanvasRenderingContext2D;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(_DPR, _DPR);

        // 테스트 위해 body 에 추가
        document.body.appendChild(cav);
        const colors: Record<string, string> = {
            temp: 'red', large: 'blue', small: 'green',
        }
        let borderColor = colors[type] || 'gold';
        cav.style = 
            `position:absolute; float:right; top:${100+this.n1}px;` +
            'right: 20px; width: 200px; height: 200px;' +
            `border: 1px solid ${borderColor};`;
        // 테스트 끝
        this.n1 = this.n1+250;

        // 맵 정보 반환
        const map:IAtlasMap = {
            cav: cav,
            ctx: ctx,
            type: type,
            slots: slots,
        };
        return map;
    }
}