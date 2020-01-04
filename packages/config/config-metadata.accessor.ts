import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CONFIG_VALUE_DEFAULTS, CONFIG_VALUE_NAME, CONFIG_VALUE_PROPERTY } from './config.constants';

@Injectable()
export class ConfigMetadataAccessor {
    constructor(
        private readonly reflector: Reflector,
    ) {
    }

    getConfigValueName(target: Function): string | undefined {
        return this.reflector.get(CONFIG_VALUE_NAME, target);
    }

    getConfigValueDefaults(target: Function): any | undefined {
        return this.reflector.get(CONFIG_VALUE_DEFAULTS, target);
    }

    getConfigValueProperty(target: Function): string | undefined {
        return this.reflector.get(CONFIG_VALUE_PROPERTY, target);
    }
}
