import 'reflect-metadata';
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { SCHEDULE_BACKEND } from '../schedule.constants';
import { Backend } from '../interfaces/backend.interface';

export function UseBackend(Backend: Backend | Function): MethodDecorator {
    return applyDecorators(
        SetMetadata(SCHEDULE_BACKEND, Backend),

        // hack
        SetMetadata('__guards__', Backend),
    );
}
