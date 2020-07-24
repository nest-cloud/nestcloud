import { Injectable } from '@nestjs/common';
import { BootStore } from './boot.store';
import { BootValueMetadata } from './interfaces/boot-value-metadata.interface';

interface WatcherOptions {
    name: string;
    property: string;
    target: Function;
    defaults: any;
}

@Injectable()
export class BootOrchestrator {
    private readonly configValues = new Map<string, WatcherOptions>();

    constructor(
        private readonly store: BootStore,
    ) {
    }

    public addBootValues(target: Function, bootValues: BootValueMetadata[]) {
        bootValues.forEach(({ name, defaults, property }) => {
            const key = `${name}__${property}__${target.constructor.name}`;
            this.configValues.set(key, { name, property, target, defaults });
        });
    }

    async mountBootValues() {
        for (const item of this.configValues.values()) {
            const { name, property, target, defaults } = item;
            const path = name || property;

            this.store.watch(path, value => {
                if (value !== void 0) {
                    target[property] = value;
                } else if (defaults !== void 0) {
                    target[property] = value;
                }
            });
            const value = this.store.get(path, defaults);
            if (value !== void 0) {
                target[property] = value;
            }
        }
    }
}
