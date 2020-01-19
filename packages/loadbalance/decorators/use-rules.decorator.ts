import { Rule } from '..';
import { ExtendArrayMetadata, applyDecorators } from '@nestcloud/common';
import { RULES_METADATA, GUARDS_METADATA } from '../loadbalance.constants';

export function UseRules(...filters: (Rule | Function)[]) {
    return applyDecorators(
        ExtendArrayMetadata(RULES_METADATA, filters),
        ExtendArrayMetadata(GUARDS_METADATA, filters),
    );
}
