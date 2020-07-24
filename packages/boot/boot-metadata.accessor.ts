import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BOOT_VALUE } from './boot.constants';
import { BootValueMetadata } from './interfaces/boot-value-metadata.interface';

@Injectable()
export class BootMetadataAccessor {
    constructor(
        private readonly reflector: Reflector,
    ) {
    }

    getBootValues(target: Function): BootValueMetadata[] | undefined {
        try {
            return this.reflector.get(BOOT_VALUE, target);
        } catch (e) {
            return;
        }
    }
}
