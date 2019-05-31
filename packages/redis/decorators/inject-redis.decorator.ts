import { Inject } from '@nestjs/common';
import { REDIS_CLIENT } from "../constants";

export const InjectRedis = (name: string = 'default') => Inject(REDIS_CLIENT + name);
