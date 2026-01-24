import IDBWorker from './idb.worker?worker'

interface _IF_PENDING {
    resolve: any;
    reject: any;
}
interface _IF_MESSAGE {
    id: number,
    ok: boolean,
    result: any,
    error: any
}

export class _MAIN 
{
    private worker: Worker;
    private seq: number = 0;
    private pending: Map<number, _IF_PENDING> = new Map();

    // constructor(args: Record<string, any>={}) {
    constructor() {
        this.worker = new IDBWorker();
        this.worker.onmessage = (e: MessageEvent) => this.Message(e.data);
    }
    
    private Message(data: _IF_MESSAGE)
    {
        const { id, ok, result, error } = data;
        const pending = this.pending.get(id);
        if(!pending) return;

        this.pending.delete(id);

        if(ok) {pending.resolve(result)}
        else {
            pending.reject(error);
            console.warn(data);
        }
    }

    /**
     * Worker에 "업무 의도"를 전달하는 유일한 통로
     * @param command worker command 이름
     * @param payload command 데이터
     * @returns Promise<any>
     */
    Call(command: string, payload: object): Promise<any> {
        return new Promise((resolve, reject) => {
            const id:number = ++this.seq;
            this.pending.set(id, { resolve, reject });
            this.worker.postMessage({
                id,
                type: command,
                payload
            });
        });
    }
}