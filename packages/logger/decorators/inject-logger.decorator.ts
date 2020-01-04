import 'reflect-metadata';
import { Inject } from '@nestjs/common';
import { LOGGER } from '@nestcloud/common';

export const InjectLogger = () => Inject(LOGGER);
