import 'reflect-metadata';
import { Inject } from '@nestjs/common';
import { NEST_LOGGER_PROVIDER } from "@nestcloud/common";

export const InjectLogger = () => Inject(NEST_LOGGER_PROVIDER);
