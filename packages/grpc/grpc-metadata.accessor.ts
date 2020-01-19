import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GrpcClientMetadata } from './interfaces/grpc-client-metadata.interface';
import { GRPC_CLIENT, GRPC_SERVICE } from './grpc.constants';
import { GrpcServiceMetadata } from './interfaces/grpc-service-metadata.interface';

@Injectable()
export class GrpcMetadataAccessor {
    constructor(
        private readonly reflector: Reflector,
    ) {
    }

    getGrpcClients(target: Function): GrpcClientMetadata[] | undefined {
        return this.reflector.get(GRPC_CLIENT, target);
    }

    getGrpcServices(target: Function): GrpcServiceMetadata[] | undefined {
        return this.reflector.get(GRPC_SERVICE, target);
    }
}
