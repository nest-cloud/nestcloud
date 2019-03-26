/**
 * @see https://github.com/silas/node-consul
 */
export interface Options {
    dependencies?: string[];
    host?: string;
    port?: number;
    secure?: boolean;
    ca?: string[] | Buffer[];
    defaults?: {
        dc?: string;
        wan?: boolean;
        consistent?: boolean;
        stale?: boolean;
        index?: string;
        token?: string;
        near?: string;
        'node-meta'?: string[];
        timeout?: number;
    };
}

export interface KVResponse {
    CreateIndex: number,
    ModifyIndex: number,
    LockIndex: number,
    Key: string,
    Flags: number,
    Value: string
}
