import { Inject } from '@nestjs/common';
import { CONSUL } from '@nestcloud/common';

export const InjectConsul = () => Inject(CONSUL);
