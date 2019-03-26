import 'reflect-metadata';
import { Inject } from '@nestjs/common';
import { NEST_BOOT_PROVIDER, Cache, NEST_BOOT } from '@nestcloud/common';
import { get } from 'lodash';
import { DYNAMIC_BOOT_VALUE } from "./constants";

const NEST_BOOT_CALLBACKS = 'NEST_BOOT_CALLBACKS';
const defines = {};

export const InjectBoot = () => Inject(NEST_BOOT_PROVIDER);

export const BootValue = (path?: string, defaultValue?: any): PropertyDecorator => {
    return function (target: any, propertyName: string | Symbol) {
        const identities = Reflect.getMetadata(DYNAMIC_BOOT_VALUE, target.constructor) || [];
        identities.push({ path: path || propertyName, defaultValue, propertyName });
        Reflect.defineMetadata(DYNAMIC_BOOT_VALUE, identities, target.constructor);
    }
};

export const Bootstrap = (): ClassDecorator => {
    return target => {
        const identities = Reflect.getMetadata(DYNAMIC_BOOT_VALUE, target) || [];
        const cache = Cache.getInstance(NEST_BOOT).get();

        identities.forEach(identity => {
            const callbacks = Cache.getInstance(NEST_BOOT_CALLBACKS).get(identity.path, []);
            callbacks.push(((target, identity) => {
                return (newVal) => {
                    target.prototype[identity.propertyName] = newVal;
                };
            })(target, identity));
            Cache.getInstance(NEST_BOOT_CALLBACKS).set(identity.path, callbacks);

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
