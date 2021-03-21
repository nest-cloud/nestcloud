import { GrpcOptions } from '@nestjs/microservices';

type GrpcOptionsOptions = GrpcOptions['options'];

export interface ClientOptions extends GrpcOptionsOptions {
  service?: string;
}
