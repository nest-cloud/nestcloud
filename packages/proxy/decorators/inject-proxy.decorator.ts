import { Inject } from '@nestjs/common';
import { NEST_PROXY_PROVIDER } from '@nestcloud/common';

export const InjectProxy = () => Inject(NEST_PROXY_PROVIDER);
