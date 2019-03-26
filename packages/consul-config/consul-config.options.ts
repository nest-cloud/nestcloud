export interface ConsulConfigOptions {
    retry?: number;
}

export interface Options {
    dependencies?: string[];
    key?: string;
    retry?: number;
}

export interface KVResponse {
    CreateIndex: number,
    ModifyIndex: number,
    LockIndex: number,
    Key: string,
    Flags: number,
    Value: string
}
