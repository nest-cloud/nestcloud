import { LOADBALANCE_SERVICE, SetMetadata, applyDecorators } from '@nestcloud/common';

export function Loadbalanced(service: string | boolean) {
    return applyDecorators(
        SetMetadata(LOADBALANCE_SERVICE, service),
    );
}
