import { BrakesOptions } from './brakes-options.interface';
import { BrakesSnapshot } from './brakes-snapshot.interface';

export interface IBrakes {
    healthCheck(healthCheck: Function);

    fallback(healthCheck: Function);

    slaveCircuit(method: Function, fallback?: Function, options?: BrakesOptions);

    on(event: 'success', handler: (data: any) => void);

    on(event: 'timeout', handler: (data: any, e: Error, exec: Function) => void);

    on(event: 'failure', handler: (data: any, e: Error, exec: Function) => void);

    on(event: 'snapshot', handler: (snapshot: BrakesSnapshot) => void);

    on(event: 'circuitClosed', handler: () => void);

    on(event: 'circuitOpen', handler: () => void);

    on(event: 'healthCheckFailed', handler: (e: Error) => void);
}
