import { Inject } from '@nestjs/common';
import { NEST_ETCD_PROVIDER } from '@nestcloud/common';

export const InjectEtcd = () => Inject(NEST_ETCD_PROVIDER);
