import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CONSUL_WATCH_KV_NAME, CONSUL_WATCH_KV_OPTIONS, CONSUL_WATCH_KV_PROPERTY } from './consul.constants';
import { WatchOptions } from './decorators/watch-kv.decorator';

@Injectable()
export class ConsulMetadataAccessor {
    constructor(
        private readonly reflector: Reflector,
    ) {
    }

    getWatchKey(target: Function): string | undefined {
        return this.reflector.get(CONSUL_WATCH_KV_NAME, target);
    }

    getWatchOptions(target: Function): WatchOptions | undefined {
        return this.reflector.get(CONSUL_WATCH_KV_OPTIONS, target);
    }

    getWatchProperty(target: Function): string | undefined {
        return this.reflector.get(CONSUL_WATCH_KV_PROPERTY, target);
    }
}
