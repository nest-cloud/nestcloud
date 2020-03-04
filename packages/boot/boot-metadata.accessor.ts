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
        try {
            return this.reflector.get(BOOT_VALUE_NAME, target);
        } catch (e) {
            return;
        }
    }

    getBootValueDefaults(target: Function): any | undefined {
        try {
            return this.reflector.get(BOOT_VALUE_DEFAULTS, target);
        } catch (e) {
            return;
        }
    }

    getBootValueProperty(target: Function): string | undefined {
        try {
            return this.reflector.get(BOOT_VALUE_PROPERTY, target);
        } catch (e) {
            return;
        }
    }
}
