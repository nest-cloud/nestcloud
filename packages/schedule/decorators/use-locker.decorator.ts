import 'reflect-metadata';
import { ILocker } from '../interfaces/locker.interface';
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { SCHEDULE_LOCKER } from '../schedule.constants';

export function UseLocker(Locker: ILocker | Function): MethodDecorator {
    return applyDecorators(
        SetMetadata(SCHEDULE_LOCKER, Locker),
    );
}
