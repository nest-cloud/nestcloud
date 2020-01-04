import { Filter } from '..';
import { extendArrayMetadata } from '@nestcloud/common';
import { FILTER_METADATA, GUARDS_METADATA } from '../proxy.constants';

export function UseFilters(...filters: (Filter | Function)[]) {
    return (target: any, key?: string, descriptor?: any) => {
        if (descriptor) {
            extendArrayMetadata(FILTER_METADATA, filters, descriptor.value);
            return descriptor;
        }
        extendArrayMetadata(GUARDS_METADATA, filters, target);
        return target;
    };
}
