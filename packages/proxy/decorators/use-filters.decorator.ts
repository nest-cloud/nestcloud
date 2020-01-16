import { Filter } from '..';
import { ExtendArrayMetadata, applyDecorators } from '@nestcloud/common';
import { FILTER_METADATA, GUARDS_METADATA } from '../proxy.constants';

export function UseFilters(...filters: (Filter | Function)[]) {
    return applyDecorators(
        ExtendArrayMetadata(FILTER_METADATA, filters),
        ExtendArrayMetadata(GUARDS_METADATA, filters),
    );
}
