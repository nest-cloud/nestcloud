import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CONSUL_KEY_VALUE } from './consul.constants';
import { KeyValueMetadata } from '@nestcloud/common';

@Injectable()
export class ConsulMetadataAccessor {
    constructor(
        private readonly reflector: Reflector,
    ) {
    }

    getKeyValues(target: Function): KeyValueMetadata[] | undefined {
        return this.reflector.get(CONSUL_KEY_VALUE, target);
    }
}
