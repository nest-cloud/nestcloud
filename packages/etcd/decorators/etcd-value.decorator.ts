import { KeyValueOptions, applyDecorators, ExtendMetadata } from '@nestcloud/common';
import { ETCD_KEY_VALUE } from '../etcd.constants';

export function EtcdValue(name: string, options?: KeyValueOptions): PropertyDecorator {
    return applyDecorators((target, property) => {
        return ExtendMetadata(ETCD_KEY_VALUE, {
            property,
            options,
            name,
        })(target, property);
    });
}
