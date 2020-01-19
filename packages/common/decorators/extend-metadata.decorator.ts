import 'reflect-metadata';

export const ExtendMetadata = <K = any, V = any>(
    metadataKey: K,
    metadataValue: V,
) => (target: object, key?: any, descriptor?: any) => {
    if (descriptor) {
        const previousValue = Reflect.getMetadata(metadataKey, descriptor.value) || [];
        const value = [...previousValue, metadataValue];
        Reflect.defineMetadata(metadataKey, value, descriptor.value);
        return descriptor;
    }

    const previousValue = Reflect.getMetadata(metadataKey, target) || [];
    const value = [...previousValue, metadataValue];
    Reflect.defineMetadata(metadataKey, value, target);
    return target;
};

export const AssignMetadata = <K = any, V = any>(
    metadataKey: K,
    metadataValue: V,
) => (target: object, key?: any, descriptor?: any) => {
    if (descriptor) {
        const previousValue = Reflect.getMetadata(metadataKey, descriptor.value) || {};
        const value = Object.assign({}, previousValue, metadataValue);
        Reflect.defineMetadata(metadataKey, value, descriptor.value);
        return descriptor;
    }

    const previousValue = Reflect.getMetadata(metadataKey, target) || {};
    const value = Object.assign({}, previousValue, metadataValue);
    Reflect.defineMetadata(metadataKey, value, target);
    return target;
};

export const ExtendArrayMetadata = <K = any, V = any>(
    metadataKey: K,
    metadataValues: Array<V>,
) => (target: object, key?: any, descriptor?: any) => {
    if (descriptor) {
        const previousValue = Reflect.getMetadata(metadataKey, descriptor.value) || [];
        const value = [...previousValue, ...metadataValues];
        Reflect.defineMetadata(metadataKey, value,  descriptor.value);
        return descriptor;
    }

    const previousValue = Reflect.getMetadata(metadataKey, target) || [];
    const value = [...previousValue, ...metadataValues];
    Reflect.defineMetadata(metadataKey, value, target);
    return target;
};
