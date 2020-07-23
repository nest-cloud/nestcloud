import { Injectable } from '@nestjs/common';
import { Scanner, ILoadbalance, IServer } from '@nestcloud/common';
import { ChooseMetadata } from './interfaces/choose-metadata.interface';
import { InjectLoadbalance } from './decorators/inject-loadbalance.decorator';

interface Choose {
    service: string;
    property: string;
    target: Function;
}

@Injectable()
export class LoadbalanceOrchestrator {
    private readonly keyValues = new Map<string, Choose>();

    constructor(
        private readonly scanner: Scanner,
        @InjectLoadbalance() private readonly lb: ILoadbalance,
    ) {
    }

    public addChooses(target: Function, chooses: ChooseMetadata[]) {
        chooses.forEach(({ service, property }) => {
            const key = `${service}__${property}__${target.constructor.name}`;
            this.keyValues.set(key, { service, property, target });
        });

    }

    public async mountChooses() {
        for (const item of this.keyValues.values()) {
            const { service, property, target } = item;
            Object.defineProperty(target, property, {
                set: (server: IServer) => {
                    return server;
                },
                get: () => {
                    return this.lb.choose(service);
                },
            });
        }
    }
}
