import { Inject } from '@nestjs/common';
import { SCHEDULE } from '@nestcloud/common';

export const InjectSchedule = () => Inject(SCHEDULE);
