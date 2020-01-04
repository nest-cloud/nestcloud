import { Inject } from '@nestjs/common';
import { CONFIG } from '@nestcloud/common';

export const InjectConfig = () => Inject(CONFIG);
