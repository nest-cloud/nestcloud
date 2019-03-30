import { Inject } from '@nestjs/common';
import { NEST_BOOT_PROVIDER } from '@nestcloud/common';

export const InjectBoot = () => Inject(NEST_BOOT_PROVIDER);
