import { Inject } from '@nestjs/common';
import { NEST_CONSUL_LOADBALANCE_PROVIDER } from "@nestcloud/common";

export const InjectLoadbalance = () => Inject(NEST_CONSUL_LOADBALANCE_PROVIDER);
