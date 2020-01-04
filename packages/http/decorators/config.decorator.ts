import 'reflect-metadata';
import { OPTIONS_METADATA } from '../http.constants';
import { applyDecorators, AssignMetadata } from '@nestcloud/common/decorators';

export function ResponseType(type: string) {
    return applyDecorators(
        AssignMetadata(OPTIONS_METADATA, { responseType: type }),
    );
}

export function ResponseEncoding(encoding: string) {
    return applyDecorators(
        AssignMetadata(OPTIONS_METADATA, { responseEncoding: encoding }),
    );
}
