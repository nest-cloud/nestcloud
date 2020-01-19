import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { Scanner, Watch, KeyValueOptions, KeyValueMetadata, setValue } from '@nestcloud/common';
import { Consul } from './consul.class';
import { KVResponse } from './interfaces/consul-kv-response.interface';
import { CONSUL_WATCH_ERROR } from './consul.messages';
import { InjectConsul } from './decorators/inject-consul.decorator';

interface KeyValue {
    name: string;
    property: string;
    target: Function;
    options: KeyValueOptions;
    watcher?: Watch;
}

@Injectable()
export class ConsulOrchestrator implements OnApplicationBootstrap, OnApplicationShutdown {
    private readonly keyValues = new Map<string, KeyValue>();
    private logger = new Logger(ConsulOrchestrator.name);

    constructor(
        private readonly scanner: Scanner,
        @InjectConsul() private readonly consul: Consul,
    ) {
    }

    public addKeyValues(target: Function, keyValues: KeyValueMetadata[]) {
        keyValues.forEach(({ name, property, options }) => {
            const key = `${name}__${property}__${target.constructor.name}`;
            this.keyValues.set(key, { name, property, target, options });
        });

    }

    async onApplicationBootstrap(): Promise<void> {
        await this.mountKeyValues();
    }

    onApplicationShutdown(signal?: string): any {
        this.keyValues.forEach(item => item.watcher ? item.watcher.end() : '');
    }

    private async mountKeyValues() {
        for (const item of this.keyValues.values()) {
            const { name, property, target, options = {} } = item;
            try {
                const res = await this.consul.kv.get<KVResponse>(name);
                if (res) {
                    setValue(target, res.Value, property, options);
                }
            } catch (e) {
                this.logger.error(CONSUL_WATCH_ERROR(name), e);
            }

            const watcher = this.consul.watch({
                method: this.consul.kv.get,
                options: { key: name, wait: '5m', timeout: 3000000 },
            });
            watcher.on('change', (res: KVResponse) => {
                if (res) {
                    setValue(target, res.Value, property, options);
                }
            });
            watcher.on('error', e => this.logger.error(CONSUL_WATCH_ERROR(name), e));
            item.watcher = watcher;
        }
    }
}
