import 'reflect-metadata';
import { INTERCEPTOR_METADATA, GUARDS_METADATA } from '../http.constants';
import { Interceptor } from '../interfaces/interceptor.interface';
import { applyDecorators, ExtendArrayMetadata } from '@nestcloud/common/decorators';

export function UseInterceptors(...Interceptors: (Interceptor | Function)[]) {
    return applyDecorators(
        ExtendArrayMetadata(INTERCEPTOR_METADATA, Interceptors),
        ExtendArrayMetadata(GUARDS_METADATA, Interceptors),
    );
}
