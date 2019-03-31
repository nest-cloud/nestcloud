import { Inject } from '@nestjs/common';
import { NEST_GATEWAY_PROVIDER } from '@nestcloud/common';

export const InjectGateway = () => Inject(NEST_GATEWAY_PROVIDER);
