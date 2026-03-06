
export namespace _LT
{
    type COMMAND_ID = 'abc' | 'def';
    export interface QUEUE {
        id: COMMAND_ID,
        data: Record<string, any>,
    }
}