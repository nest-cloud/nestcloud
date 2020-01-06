import 'reflect-metadata';
import {
    BRAKES, INTERCEPTOR_METADATA,
    METHOD_METADATA,
    OPTIONS_METADATA,
    PATH_METADATA,
    REQUEST_PARAMS_METADATA,
    RESPONSE,
    RESPONSE_HEADER,
} from './http.constants';
import { getMetadata } from '@nestcloud/common';
import { Injectable } from '@nestjs/common';
import { ParamsMetadata } from './interfaces/params-metadata.interface';
import { LOADBALANCE_SERVICE } from '@nestcloud/common';

@Injectable()
export class HttpMetadataAccessor {
    getUrl(instance: Function, target: Function): string | undefined {
        return getMetadata(PATH_METADATA, target, instance.constructor);
    }

    getMethod(instance: Function, target: Function): string | undefined {
        return getMetadata(METHOD_METADATA, target, instance.constructor);
    }

    getResponseConfig(instance: Function, target: Function): string | undefined {
        let responseType = getMetadata(RESPONSE, target, instance.constructor);
        if (!responseType) {
            responseType = getMetadata(RESPONSE_HEADER, target, instance.constructor);
        }
        return responseType;
    }

    getParams(instance: Function, key: any): ParamsMetadata | undefined {
        return Reflect.getMetadata(REQUEST_PARAMS_METADATA, instance.constructor, key);
    }

    getOptions(instance: Function, target: Function) {
        return getMetadata(OPTIONS_METADATA, target, instance.constructor);
    }

    getService(instance: Function, target: Function): string | undefined {
        return getMetadata<string>(LOADBALANCE_SERVICE, target, instance.constructor);
    }

    getBrakesName(instance: Function, target: Function): string | undefined {
        return getMetadata(BRAKES, target, instance.constructor);
    }

    getInterceptorTargets(instance: Function, target: Function): Function[] | undefined {
        return getMetadata<Function[]>(INTERCEPTOR_METADATA, target, instance.constructor);
    }
}
