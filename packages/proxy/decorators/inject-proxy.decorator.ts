import { Inject } from '@nestjs/common';
import { PROXY } from '@nestcloud/common';

export const InjectProxy = () => Inject(PROXY);
