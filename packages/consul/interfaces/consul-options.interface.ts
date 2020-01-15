/**
 * @see https://github.com/silas/node-consul
 */
import { IConsulOptions } from '@nestcloud/common';

export interface ConsulOptions extends IConsulOptions {
    host?: string;
    port?: string;
    secure?: boolean;
    ca?: string[];
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

export interface AsyncConsulOptions {
    inject?: string[];
}
