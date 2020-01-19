import 'reflect-metadata';
import { RESPONSE, RESPONSE_HEADER, RESPONSE_BODY } from '../http.constants';
import { applyDecorators, SetMetadata } from '@nestcloud/common/decorators';

export function Response() {
    return applyDecorators(
        SetMetadata(RESPONSE, RESPONSE),
    );
}

export function ResponseHeader() {
    return applyDecorators(
        SetMetadata(RESPONSE_HEADER, RESPONSE_HEADER),
    );
}

export function ResponseBody() {
    return applyDecorators(
        SetMetadata(RESPONSE_BODY, RESPONSE_BODY),
    );
}
