import "reflect-metadata";
import { INTERCEPTOR_METADATA, GUARDS_METADATA } from "../constants";
import { extendMetadata } from "../utils/MetadataUtil";
import { IInterceptor } from "../interfaces/IInterceptor";

export const UseInterceptor = (Interceptor: IInterceptor | Function) => (target, key?, descriptor?) => {
    extendMetadata(INTERCEPTOR_METADATA, Interceptor, key ? descriptor.value : target);

    // hack
    extendMetadata(GUARDS_METADATA, Interceptor, key ? descriptor.value : target);
};
