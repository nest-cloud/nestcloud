import { Inject } from '@nestjs/common';
import { NEST_MEMCACHED_PROVIDER } from '@nestcloud/common';

export const InjectMemcachedClient = () => Inject(NEST_MEMCACHED_PROVIDER);
