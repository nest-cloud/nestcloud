import { BODY_METADATA, HEADER_METADATA, PARAMS_METADATA, QUERY_METADATA } from "../constants";
import { isEmpty } from 'lodash';

export const getMetadata = (value, target, oldValue) => (paramType) => {
    let result = Reflect.getMetadata(paramType, value);
    if (!result && oldValue) {
        result = Reflect.getMetadata(paramType, oldValue);
    }
    if (!result) {
        result = Reflect.getMetadata(paramType, target.constructor);
    }
    if (!result) {
        result = Reflect.getMetadata(paramType, target);
    }
    return result;
};

export const getParams = (metadata, args) => {
    const params = {}, data = {}, uriParams = {}, headers = {};

    for (const key in metadata) {
        if (!metadata.hasOwnProperty(key)) {
            continue;
        }

        const meta = metadata[key];
        let target = null;
        switch (key.split(':')[0]) {
            case PARAMS_METADATA:
                target = uriParams;
                break;
            case QUERY_METADATA:
                target = params;
                break;
            case BODY_METADATA:
                target = data;
                break;
            case HEADER_METADATA:
                target = headers;
                break;
        }

        if (target) {
            if (meta.data) {
                target[meta.data] = meta.index.toString().indexOf('const') !== -1 ? meta.value : args[meta.index];
            } else {
                Object.assign(target, meta.index.toString().indexOf('const') !== -1 ? meta.value : args[meta.index]);
            }
        }
    }
    return { params, data: isEmpty(data) ? undefined : data, uriParams, headers };
};
