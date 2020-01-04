import { Inject } from '@nestjs/common';
import { ETCD } from '@nestcloud/common';

export const InjectEtcd = () => Inject(ETCD);
