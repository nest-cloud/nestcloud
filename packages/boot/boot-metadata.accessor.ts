import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BOOT_VALUE_DEFAULTS, BOOT_VALUE_NAME, BOOT_VALUE_PROPERTY } from './boot.constants';

@Injectable()
export class BootMetadataAccessor {
    constructor(
        private readonly reflector: Reflector,
    ) {
    }

    getBootValueName(target: Function): string | undefined {
        return this.reflector.get(BOOT_VALUE_NAME, target);
    }

    getBootValueDefaults(target: Function): any | undefined {
        return this.reflector.get(BOOT_VALUE_DEFAULTS, target);
    }

    getBootValueProperty(target: Function): string | undefined {
        return this.reflector.get(BOOT_VALUE_PROPERTY, target);
    }
}
