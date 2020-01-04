import { Inject } from '@nestjs/common';
import { LOADBALANCE } from '@nestcloud/common';

export const InjectLoadbalance = () => Inject(LOADBALANCE);
