export interface ParamMetadata {
    index: number;
    data: string;
    value?: any;
}

export declare type ParamsMetadata = Record<string, ParamMetadata>;
