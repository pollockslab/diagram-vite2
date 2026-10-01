// [Diagram] 다이어그램 거래 모음
import { _VIEW, _REMO, _LOOP, _SPCE, _STOR, _MNGR } from '@/main';
import * as Diagrams from '@/diagrams/diagrams'
import * as DiagramsType from '@/diagrams/diagrams.type'
import * as IndexeddbType from '@/engines/indexeddb/indexeddb.type'
import * as Common from '@/engines/common'


export async function Insert(
    data: {type: DiagramsType.ClassName; [key: string]: unknown},
): Promise<DiagramsType.Instance> {
    let diagram;
    await _STOR.Transaction(['diagram'], 'readwrite', async (cmd) => {
        diagram = await InsertTX(cmd, data);
    });
    if(!diagram) {throw new Error('Failed to insert diagram')}
    return diagram;
}
export async function InsertTX(
    cmd: IndexeddbType.StoreCommand,
    data: {type: DiagramsType.ClassName; [key: string]: unknown},
): Promise<DiagramsType.Instance> {
    const typeClass = Diagrams.Class[data.type];
    if(!typeClass) {throw new Error(`Diagram type not found: '${data.type}'`);}
    const diagram = new typeClass();

    // [Patch] 원본 초기값 + 전달받은 데이터
    const serialize = Common.PatchObjectDeep(typeClass.origin, data);

    // [New] 아이디 없으면 생성 / [Upgrade] 저장 버전 증가
    serialize.axis.id      = serialize.axis.id || crypto.randomUUID();
    serialize.axis.version = serialize.axis.version + 1;

    // [Sync] 다이어그램에 값 반영
    diagram.serialize = serialize;

    // [Insert] DB에 저장
    await cmd.Add('diagram', diagram.serialize);

    return diagram;
}
