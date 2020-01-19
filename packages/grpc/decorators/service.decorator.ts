import { ClientOptions } from '../interfaces/client-options.interface';
import { GRPC_CLIENT } from '../grpc.constants';
import { applyDecorators, ExtendMetadata } from '@nestcloud/common';

export function Service(name: string, options?: ClientOptions): PropertyDecorator {
    return applyDecorators((target, property) => {
        return ExtendMetadata(GRPC_CLIENT, {
            name,
            property,
            options,
        })(target, property);
    });
}
