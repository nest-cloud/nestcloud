import { Inject } from '@nestjs/common';
import { NEST_CONSUL_CONFIG_PROVIDER } from '@nestcloud/common';

export const InjectConfig = () => Inject(NEST_CONSUL_CONFIG_PROVIDER);
