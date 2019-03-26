import 'reflect-metadata';
import { Inject } from '@nestjs/common';
import { get } from 'lodash';
import { NEST_CONSUL_CONFIG_PROVIDER, Cache, NEST_CONSUL_CONFIG } from '@nestcloud/common';
import { DYNAMIC_CONFIG_VALUE } from "./constants";

const NEST_CONSUL_CONFIG_CALLBACKS = 'NEST_CONSUL_CONFIG_CALLBACKS';

let defines = {};

export const InjectConfig = () => Inject(NEST_CONSUL_CONFIG_PROVIDER);


export const ConfigValue = (path?: string, defaultValue?: any): PropertyDecorator => {
    return function (target: any, propertyName: string | Symbol) {
        const identities = Reflect.getMetadata(DYNAMIC_CONFIG_VALUE, target.constructor) || [];
        identities.push({ path: path || propertyName, defaultValue, propertyName });
        Reflect.defineMetadata(DYNAMIC_CONFIG_VALUE, identities, target.constructor);
    }
};

export const Configuration = (): ClassDecorator => {
    return target => {
        const identities = Reflect.getMetadata(DYNAMIC_CONFIG_VALUE, target) || [];
        const cache = Cache.getInstance(NEST_CONSUL_CONFIG).get();
        identities.forEach(identity => {
            const callbacks = Cache.getInstance(NEST_CONSUL_CONFIG_CALLBACKS).get(identity.path, []);
            callbacks.push(((target, identity) => {
                return (newVal) => {
                    target.prototype[identity.propertyName] = newVal;
                };
            })(target, identity));
            Cache.getInstance(NEST_CONSUL_CONFIG_CALLBACKS).set(identity.path, callbacks);

            if (!defines[identity.path]) {
                Object.defineProperty(cache, identity.path, {
                    set: (newVal) => {
                        callbacks.forEach(cb => cb(newVal));
                    },
                });
                defines[identity.path] = true;
            }

            target.prototype[identity.propertyName] = get(cache, identity.path, identity.defaultValue);
        })
    }
};
