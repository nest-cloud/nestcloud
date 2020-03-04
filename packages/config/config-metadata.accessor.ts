import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CONFIG_VALUE } from './config.constants';
import { ConfigValueMetadata } from './interfaces/config-value-metadata.interface';

@Injectable()
export class ConfigMetadataAccessor {
    constructor(
        private readonly reflector: Reflector,
    ) {
    }

    getConfigValues(target: Function): ConfigValueMetadata[] | undefined {
        try {
            return this.reflector.get(CONFIG_VALUE, target);
        } catch (e) {
            return;
        }
    }
}
