import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ETCD_KEY_VALUE } from './etcd.constants';
import { KeyValueMetadata } from '@nestcloud/common';

@Injectable()
export class EtcdMetadataAccessor {
    constructor(
        private readonly reflector: Reflector,
    ) {
    }

    getKeyValues(target: Function): KeyValueMetadata[] | undefined {
        return this.reflector.get(ETCD_KEY_VALUE, target);
    }
}
