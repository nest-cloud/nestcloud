import { Inject } from '@nestjs/common';
import { BOOT } from '@nestcloud/common';

export const InjectBoot = () => Inject(BOOT);
