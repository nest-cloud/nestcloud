import { applyDecorators, KeyValueOptions, ExtendMetadata } from '@nestcloud/common';
import { CONSUL_KEY_VALUE } from '../consul.constants';

export function KeyValue(name: string, options?: KeyValueOptions): PropertyDecorator {
    return applyDecorators((target, property) => {
        return ExtendMetadata(CONSUL_KEY_VALUE, {
            property,
            options,
            name,
        })(target, property);
    });
}
