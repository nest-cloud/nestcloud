import "reflect-metadata";
import { isEmpty } from 'lodash';
import {
    PATH_METADATA,
    METHOD_METADATA,
    OPTIONS_METADATA,
    RESPONSE,
    RESPONSE_HEADER,
    REQUEST_PARAMS_METADATA,
    SERVICE,
    BRAKES,
    BRAKES_CIRCUIT,
    INTERCEPTOR_METADATA
} from '../constants';
import { getParams } from '../utils/getter';
import { getMetadata } from '../utils/MetadataUtil';
import { AxiosRequestConfig } from 'axios';
import * as Brakes from 'brakes';
import * as Circuit from 'brakes/lib/Circuit';
import { RequestCreator } from "../RequestCreator";
import { chooseModule, getInstance } from "../utils/ModuleUtil";

export const Get = (path: string, options?: AxiosRequestConfig): MethodDecorator => createMappingDecorator('GET', path, options);

export const Post = (path: string, options?: AxiosRequestConfig): MethodDecorator => createMappingDecorator('POST', path, options);

export const Put = (path: string, options?: AxiosRequestConfig): MethodDecorator => createMappingDecorator('PUT', path, options);

export const Delete = (path: string, options?: AxiosRequestConfig): MethodDecorator => createMappingDecorator('DELETE', path, options);

export const Head = (path: string, options?: AxiosRequestConfig): MethodDecorator => createMappingDecorator('HEAD', path, options);

export const Patch = (path: string, options?: AxiosRequestConfig): MethodDecorator => createMappingDecorator('PATCH', path, options);

export const Options = (path: string, options?: AxiosRequestConfig): MethodDecorator => createMappingDecorator('OPTIONS', path, options);

export const Trace = (path: string, options?: AxiosRequestConfig): MethodDecorator => createMappingDecorator('GET', path, options);

const createMappingDecorator = (method: string, path: string, options?: object) => (target, key, descriptor) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);
    if (options) {
        const opts = Reflect.getMetadata(OPTIONS_METADATA, descriptor.value) || {};
        Reflect.defineMetadata(OPTIONS_METADATA, Object.assign({}, opts, options), descriptor.value);
    }

    const oldDescriptorValue = descriptor.value;
    descriptor.value = async (...params) => {
        const url = getMetadata(PATH_METADATA, descriptor.value, target);
        const method = getMetadata(METHOD_METADATA, descriptor.value, target);
        const responseType =
            getMetadata(RESPONSE, descriptor.value, target) ||
            getMetadata(RESPONSE_HEADER, descriptor.value, target);
        const paramMetadata = Reflect.getMetadata(REQUEST_PARAMS_METADATA, target.constructor, key);

        // axios config
        const options: AxiosRequestConfig = getMetadata(OPTIONS_METADATA, descriptor.value, target) || {};
        const parameters = getParams(paramMetadata, params);
        const serviceName = getMetadata<string>(SERVICE, descriptor.value, target);

        let circuit = getMetadata(BRAKES_CIRCUIT, descriptor.value, target) as Circuit;
        if (!circuit) {
            let brakes = getMetadata(BRAKES, descriptor.value, target) as Brakes;
            if (brakes === void 0) {
                brakes = Reflect.getMetadata(BRAKES, target.constructor);
            }
            if (brakes && brakes !== 'none') {
                circuit = brakes.slaveCircuit.bind(brakes) as Circuit;
                Reflect.defineMetadata(BRAKES_CIRCUIT, circuit, descriptor.value);
            }
        }

        const InterceptorMetatypes = (
            getMetadata<Function[]>(INTERCEPTOR_METADATA, descriptor.value, target) || [])
            .concat((Reflect.getMetadata(INTERCEPTOR_METADATA, target.constructor) || [])
            );

        const interceptors = [];
        if (InterceptorMetatypes.length) {
            const module = chooseModule(InterceptorMetatypes[0] as Function);
            if (module) {
                InterceptorMetatypes.forEach((metatype: Function) => {
                    const instance = getInstance(module, metatype);
                    if (instance) {
                        interceptors.push(instance);
                    }
                })
            }
        }

        return await RequestCreator.create(url, method, parameters, options, serviceName, circuit, interceptors, responseType);
    };
    const metadataKeys = Reflect.getMetadataKeys(oldDescriptorValue);
    metadataKeys.forEach(key =>
        Reflect.defineMetadata(key, Reflect.getMetadata(key, oldDescriptorValue), descriptor.value)
    );
    return descriptor;
};
