import 'reflect-metadata';
import { OPTIONS_METADATA } from '../constants';

export const ResponseType = (type: string): MethodDecorator => createConfigDecorator('responseType', type);
export const ResponseEncoding = (encode: string): MethodDecorator => createConfigDecorator('responseEncoding', encode);

const createConfigDecorator = (field: string, value: string) => (target, key, descriptor) => {
    const options = Reflect.getMetadata(OPTIONS_METADATA, descriptor.value) || {};
    options[field] = value;
    Reflect.defineMetadata(OPTIONS_METADATA, options, descriptor.value);
};
