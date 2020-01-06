import { applyDecorators, ExtendMetadata } from '@nestcloud/common';
import { GRPC_CLIENT } from '../grpc.constants';
import { ClientOptions } from '../interfaces/client-options.interface';

export function RpcClient(options?: ClientOptions): PropertyDecorator {
    return applyDecorators((target, property) => {
        return ExtendMetadata(GRPC_CLIENT, {
            property,
            options,
        })(target, property);
    });
}
