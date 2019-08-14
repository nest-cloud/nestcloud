import { Inject } from '@nestjs/common';
import { NEST_SERVICE_PROVIDER } from '@nestcloud/common';

export const InjectService = () => Inject(NEST_SERVICE_PROVIDER);
