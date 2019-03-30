import "reflect-metadata";
import { INTERCEPTOR_METADATA, GUARDS_METADATA } from "../constants";
import { extendMetadata } from "../utils/metadata.util";
import { IInterceptor } from "../interfaces/interceptor.interface";

export const UseInterceptor = (Interceptor: IInterceptor | Function) => (target, key?, descriptor?) => {
    extendMetadata(INTERCEPTOR_METADATA, Interceptor, key ? descriptor.value : target);

    // hack
    extendMetadata(GUARDS_METADATA, Interceptor, key ? descriptor.value : target);
};
