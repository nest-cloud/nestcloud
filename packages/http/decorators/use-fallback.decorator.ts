import { IFallback } from '../interfaces/fallback.interface';
import { BRAKES_FALLBACK_METADATA, GUARDS_METADATA } from '../constants';
import { extendMetadata } from '../utils/metadata.util';

export const UseFallback = (Fallback: IFallback | Function) => (target, key?, descriptor?) => {
    extendMetadata(BRAKES_FALLBACK_METADATA, Fallback, key ? descriptor.value : target);

    // hack
    extendMetadata(GUARDS_METADATA, Fallback, key ? descriptor.value : target);
};
