import { Inject } from '@nestjs/common';
import { NEST_RBAC_PROVIDER } from '@nestcloud/common';

export const InjectRbac = () => Inject(NEST_RBAC_PROVIDER);
