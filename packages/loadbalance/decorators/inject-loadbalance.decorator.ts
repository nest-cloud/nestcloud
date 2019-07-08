import { Inject } from '@nestjs/common';
import { NEST_LOADBALANCE_PROVIDER } from '@nestcloud/common';

export const InjectLoadbalance = () => Inject(NEST_LOADBALANCE_PROVIDER);
