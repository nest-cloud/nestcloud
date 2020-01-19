import { Injectable } from '@nestjs/common';
import { BrakesFactory } from './brakes.factory';
import { BrakesRegistry } from './brakes.registry';
import { Fallback } from './interfaces/fallback.interface';

@Injectable()
export class Brakes {
    constructor(
        private readonly brakesFactory: BrakesFactory,
        private readonly brakesRegistry: BrakesRegistry,
    ) {
    }

    slave(name: string, fallback: Fallback, ref: Function): Function;
    slave(fallback: Fallback, ref: Function): Function;
    slave(name: string, ref: Function): Function;
    slave(
        nameOrFallback: string | Fallback,
        fallbackOrRef: Fallback | Function,
        func?: Function): Function {
        const [name, fallback, ref] =
            typeof nameOrFallback === 'string' && func ?
                [nameOrFallback as string, fallbackOrRef as Fallback, func] :
                typeof nameOrFallback === 'string' && !func ?
                    [nameOrFallback, undefined, fallbackOrRef as Function] :
                    [undefined, nameOrFallback as Fallback, fallbackOrRef as Function];

        let brakes = this.brakesRegistry.getBrakes(name);
        if (!brakes) {
            brakes = this.brakesFactory.create(name);
        }

        let circuit;
        if (fallback) {
            circuit = brakes.slaveCircuit(
                ref,
                fallback.fallback,
                fallback.config ? fallback.config() : {},
            );
        } else {
            circuit = brakes.slaveCircuit(ref);
        }

        return circuit.exec.bind(circuit);
    }
}
