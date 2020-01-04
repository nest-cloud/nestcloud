import { Fallback } from '../interfaces/fallback.interface';
import { BRAKES_FALLBACK_METADATA, GUARDS_METADATA } from '../http.constants';
import { applyDecorators, ExtendArrayMetadata } from '../../common/decorators';

export function UseFallbacks(...Fallbacks: (Fallback | Function)[]) {
    return applyDecorators(
        ExtendArrayMetadata(BRAKES_FALLBACK_METADATA, Fallbacks),
        ExtendArrayMetadata(GUARDS_METADATA, Fallbacks),
    );
}
