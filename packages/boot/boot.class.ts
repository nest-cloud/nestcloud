import { IBoot } from '@nestcloud/common';
import { Store } from './store';
import { Injectable } from '@nestjs/common';
import { BootConfig } from './boot.config';
import { BootLoader } from './boot.loader';

@Injectable()
export class Boot implements IBoot {
    constructor(
        private readonly bootConfig: BootConfig,
        private readonly bootLoader: BootLoader,
    ) {
        Store.data = this.bootLoader.load();
        if (this.bootConfig.isWatch()) {
            this.bootLoader.watch(data => Store.data = data);
        }
    }

    get<T extends any>(path?: string, defaults?: T): T {
        return Store.get<T>(path, defaults);
    }
}
