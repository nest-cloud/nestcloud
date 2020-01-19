import 'reflect-metadata';
import { INTERCEPTOR_METADATA } from '../http.constants';
import { Interceptor } from '../interfaces/interceptor.interface';
import { applyDecorators, ExtendArrayMetadata, GUARDS_METADATA } from '@nestcloud/common';

export function UseInterceptors(...Interceptors: (Interceptor | Function)[]) {
    return applyDecorators(
        ExtendArrayMetadata(INTERCEPTOR_METADATA, Interceptors),
        ExtendArrayMetadata(GUARDS_METADATA, Interceptors),
    );
}
