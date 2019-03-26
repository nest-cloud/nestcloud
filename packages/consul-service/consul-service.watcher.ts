import * as Consul from 'consul';
import { get } from 'lodash';

export class Watcher {
    private watcher;
    private callback: (e, nodes) => void;
    private lastChangeTime: number;

    constructor(
        private readonly consul: Consul,
        private readonly options: { retry?: number; method: any; params?: object; },
    ) {
    }

    getLastChangeTime() {
        return this.lastChangeTime;
    }

    watch(callback: (e, nodes) => void) {
        if (this.watcher) this.watcher.end();

        this.callback = callback;
        this.watcher = this.consul.watch({
            method: this.options.method,
            options: this.options.params
        });
        this.watcher.on('change', data => {
            callback(null, data);
            this.lastChangeTime = new Date().getTime();
        });
        this.watcher.on('error', e => {
            callback(e, null);
        });
    }

    end() {
        if (this.watcher) {
            this.watcher.end();
        }
    }

    clear() {
        this.end();
        this.watcher = null;
    }
}
