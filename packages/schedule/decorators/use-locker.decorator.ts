import 'reflect-metadata';
import { Locker } from '../interfaces/locker.interface';
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { SCHEDULE_LOCKER } from '../schedule.constants';

export function UseLocker(Locker: Locker | Function): MethodDecorator {
    return applyDecorators(
        SetMetadata(SCHEDULE_LOCKER, Locker),

        // hack
        SetMetadata('__guards__', Locker),
    );
}
