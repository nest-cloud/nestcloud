import 'reflect-metadata';
import { applyDecorators, SetMetadata } from '@nestcloud/common';
import { CONFIG_VALUE_DEFAULTS, CONFIG_VALUE_NAME, CONFIG_VALUE_PROPERTY } from '../config.constants';

export function ConfigValue(path?: string, defaults?: string): PropertyDecorator {
    return applyDecorators(
        SetMetadata(CONFIG_VALUE_DEFAULTS, defaults),
        SetMetadata(CONFIG_VALUE_NAME, path),
        (target, propertyKey) => {
            return SetMetadata(CONFIG_VALUE_PROPERTY, propertyKey)(target, propertyKey);
        },
    );
}
