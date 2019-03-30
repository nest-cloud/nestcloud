/**
 * @see https://github.com/silas/node-consul
 */
export interface IConsulOptions {
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
