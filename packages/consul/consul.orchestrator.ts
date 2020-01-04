import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { WatchOptions } from './decorators/watch-kv.decorator';
import { Scanner, Watch } from '@nestcloud/common';
import { Consul } from './consul.class';
import { KVResponse } from './interfaces/consul-kv-response.interface';
import * as YAML from 'yamljs';
import { CONSUL_WATCH_ERROR } from './consul.messages';
import { InjectConsul } from './decorators/inject-consul.decorator';

interface WatcherOptions {
    name: string;
    property: string;
    target: Function;
    options: WatchOptions;
    watcher?: Watch;
}

@Injectable()
export class ConsulOrchestrator implements OnApplicationBootstrap, OnApplicationShutdown {
    private readonly watchers = new Map<string, WatcherOptions>();
    private logger = new Logger(ConsulOrchestrator.name);

    constructor(
        private readonly scanner: Scanner,
        @InjectConsul() private readonly consul: Consul,
    ) {
    }

    public addWatcher(name: string, property: string, target: Function, options: WatchOptions) {
        const key = `${name}__${property}__${target.constructor.name}`;
        this.watchers.set(key, { name, property, target, options });
    }

    async onApplicationBootstrap(): Promise<void> {
        await this.mountWatcher();
    }

    onApplicationShutdown(signal?: string): any {
        this.watchers.forEach(item => item.watcher ? item.watcher.end() : '');
    }

    private async mountWatcher() {
        for (const item of this.watchers.values()) {
            const { name, property, target, options = {} } = item;
            try {
                const res = await this.consul.kv.get<KVResponse>(name);
                this.setValue(target, res.Value, property, options);
            } catch (e) {
                this.logger.error(CONSUL_WATCH_ERROR(name), e);
            }

            const watcher = this.consul.watch({
                method: this.consul.kv.get,
                options: { key: name, wait: '5m', timeout: 3000000 },
            });
            watcher.on('change', (res: KVResponse) => this.setValue(target, res.Value, property, options));
            watcher.on('error', e => this.logger.error(CONSUL_WATCH_ERROR(name), e));
            item.watcher = watcher;
        }
    }

    private setValue(target: Function, value: any, property: string, options: WatchOptions = { type: 'text' }) {
        if (options.type === 'json') {
            try {
                value = JSON.parse(value);
            } catch (e) {
                value = {};
            }
        } else if (options.type === 'yaml') {
            try {
                value = YAML.parse(value);
            } catch (e) {
                value = {};
            }
        }
        target.constructor.prototype[property] = value;
    }
}
