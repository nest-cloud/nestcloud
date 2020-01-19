import 'reflect-metadata';

export const SetMetadata = <K = any, V = any>(
    metadataKey: K,
    metadataValue: V,
) => (target: object, key?: any, descriptor?: any) => {
    if (descriptor) {
        Reflect.defineMetadata(metadataKey, metadataValue, descriptor.value);
        return descriptor;
    }
    Reflect.defineMetadata(metadataKey, metadataValue, target);
    return target;
};
