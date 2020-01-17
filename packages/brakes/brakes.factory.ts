import * as BrakesClass from 'brakes';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { BrakesRegistry } from './brakes.registry';
import { BrakesOptions } from './interfaces/brakes-options.interface';
import { BRAKES_OPTIONS_PROVIDER } from './brakes.constants';
import { IBrakes } from './interfaces/brakes.interface';

@Injectable()
export class BrakesFactory {
    private readonly logger = new Logger(BrakesFactory.name);

    constructor(
        private readonly brakesRegistry: BrakesRegistry,
        @Inject(BRAKES_OPTIONS_PROVIDER) private readonly options: BrakesOptions,
    ) {
    }

    create(name: string) {
        const options = Object.assign(this.options, { isPromise: true });
        const brakesInstance: IBrakes = new BrakesClass(options);
        this.brakesRegistry.addBrakes(name, brakesInstance);

        brakesInstance.on('circuitOpen', () => {
            this.logger.warn(`Circuit named ${name} is opened.`);
        });

        brakesInstance.on('circuitClosed', () => {
            this.logger.warn(`Circuit named ${name} is closed.`);
        });

        brakesInstance.on('failure', (data, e) => {
            this.logger.error(`Circuit named ${name} is failure.`, e.stack);
        });

        brakesInstance.on('timeout', (data, e) => {
            this.logger.error(`Circuit named ${name} is failure.`, e.stack);
        });

        return brakesInstance;
    }
}
