/**
 * @see https://github.com/silas/node-consul
 */
import { IConsulOptions } from '@nestcloud/common';

export interface ConsulOptions extends IConsulOptions {
    inject?: string[];
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
