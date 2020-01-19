import 'reflect-metadata';
import { applyDecorators, SetMetadata } from '@nestcloud/common';
import { BOOT_VALUE_DEFAULTS, BOOT_VALUE_NAME, BOOT_VALUE_PROPERTY } from '../boot.constants';

export function BootValue(path?: string, defaults?: string): PropertyDecorator {
    return applyDecorators(
        SetMetadata(BOOT_VALUE_DEFAULTS, defaults),
        SetMetadata(BOOT_VALUE_NAME, path),
        (target, propertyKey) => {
            return SetMetadata(BOOT_VALUE_PROPERTY, propertyKey)(target, propertyKey);
        },
    );
}
