
export class Storage 
{
    private worker: Worker;
    private idCount: number = 0;
    private postList: Map<number, {resolve: any, reject: any}> = new Map();

    constructor() {
        this.worker = new Worker(
            new URL('./storage.worker.ts', import.meta.url), 
            {type: 'module'}
        );
        this.worker.onmessage = (e: MessageEvent) => this.On(e.data);
    }
    
    private On(data: {id: number, isCompleted: boolean, result: any, error: Error})
    {
        const post = this.postList.get(data.id);
        if(!post) { return; }
        this.postList.delete(data.id);

        if(data.isCompleted) { post.resolve(data.result); }
        else                 { post.reject (data.error ); }
    }
    
    Post(command: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const id: number = this.idCount++;
            this.postList.set(id, {resolve, reject});
            this.worker.postMessage({id, command, data});
        });
    }
}