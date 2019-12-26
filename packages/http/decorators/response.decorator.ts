import 'reflect-metadata';
import { RESPONSE, RESPONSE_HEADER, RESPONSE_BODY } from '../constants';

export const Response = (): MethodDecorator => (target, key, descriptor) => {
    Reflect.defineMetadata(RESPONSE, RESPONSE, descriptor.value);
};

export const ResponseHeader = (): MethodDecorator => (target, key, descriptor) => {
    Reflect.defineMetadata(RESPONSE_HEADER, RESPONSE_HEADER, descriptor.value);
};

export const ResponseBody = (): MethodDecorator => (target, key, descriptor) => {
    Reflect.defineMetadata(RESPONSE_BODY, RESPONSE_BODY, descriptor.value);
};
