import { applyDecorators, SetMetadata } from '@nestcloud/common';
import {
    CONSUL_WATCH_KV_NAME,
    CONSUL_WATCH_KV_OPTIONS,
    CONSUL_WATCH_KV_PROPERTY,
} from '../consul.constants';

export interface WatchOptions {
    type?: 'json' | 'yaml' | 'text';
    defaults?: any;
}

export function WatchKV(name: string, options?: WatchOptions): PropertyDecorator {
    return applyDecorators(
        SetMetadata(CONSUL_WATCH_KV_OPTIONS, options),
        SetMetadata(CONSUL_WATCH_KV_NAME, name),
        (target, propertyKey) => {
            return SetMetadata(CONSUL_WATCH_KV_PROPERTY, propertyKey)(target, propertyKey);
        },
    );
}
