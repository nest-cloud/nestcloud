export interface EtcdOptions {
    credentials?: {
        rootCertificate: Buffer;
        privateKey?: Buffer;
        certChain?: Buffer;
    };
    grpcOptions?: any;
    auth?: {
        username: string;
        password: string;
    };
    hosts?: string[] | string;
    dialTimeout?: number;
    backoffStrategy?: any;
    retry?: boolean;
}

export interface AsyncEtcdOptions {
    inject?: string[];
}
