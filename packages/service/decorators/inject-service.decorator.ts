import { Inject } from '@nestjs/common';
import { SERVICE } from '@nestcloud/common';

export const InjectService = () => Inject(SERVICE);
