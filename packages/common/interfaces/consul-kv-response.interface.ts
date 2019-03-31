export interface IKVResponse {
    CreateIndex: number;
    ModifyIndex: number;
    LockIndex: number;
    Key: string;
    Flags: number;
    Value: string;
}
