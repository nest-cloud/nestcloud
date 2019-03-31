import { Inject } from '@nestjs/common';
import { NEST_CONSUL_SERVICE_PROVIDER } from '@nestcloud/common';

export const InjectConsulService = () => Inject(NEST_CONSUL_SERVICE_PROVIDER);
