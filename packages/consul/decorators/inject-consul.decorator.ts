import { Inject } from '@nestjs/common';
import { NEST_CONSUL_PROVIDER } from "@nestcloud/common";

export const InjectConsul = () => Inject(NEST_CONSUL_PROVIDER);
