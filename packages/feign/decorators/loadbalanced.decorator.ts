import 'reflect-metadata';
import { SERVICE } from '../constants';

export const Loadbalanced = (service: string | boolean) => (target, key?, descriptor?) => {
    Reflect.defineMetadata(SERVICE, service === false ? 'none' : service, key ? descriptor.value : target);
};
