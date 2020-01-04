import { BrakesOptions } from './interfaces/brakes-options.interface';
import { v1 } from 'uuid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BrakesCreator {
    create(options: BrakesOptions) {
        if (!options.name) {
            options.name = v1();
        }
    }
}
