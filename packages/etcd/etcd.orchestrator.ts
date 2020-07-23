import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { KeyValueOptions, KeyValueMetadata, setValue } from '@nestcloud/common';
import { Etcd } from './etcd';
import { InjectEtcd } from './decorators/inject-etcd.decorator';
import { ETCD_KEY_VALUE_ERROR } from './etcd.messages';
import * as RPC from 'etcd3/lib/src/rpc';
import { Watcher } from 'etcd3/lib/src/watch';

interface KeyValue {
    name: string;
    property: string;
    target: Function;
    options: KeyValueOptions;
    watcher?: Watcher;
}

@Injectable()
export class EtcdOrchestrator implements OnApplicationShutdown {
    private readonly keyValues = new Map<string, KeyValue>();
    private logger = new Logger(EtcdOrchestrator.name);

    constructor(
        @InjectEtcd() private readonly etcd: Etcd,
    ) {
    }

    public addKeyValue(target: Function, keyValues: KeyValueMetadata[]) {
        keyValues.forEach(({ name, property, options }) => {
            const key = `${name}__${property}__${target.constructor.name}`;
            this.keyValues.set(key, { name, property, target, options });
        });
    }

    onApplicationShutdown(signal?: string): any {
        this.keyValues.forEach(item => item.watcher ? item.watcher.cancel() : '');
    }

    public async mountKeyValues() {
        for (const item of this.keyValues.values()) {
            const { name, property, target, options = {} } = item;
            try {
                const value = await this.etcd.get(name).string();
                setValue(target, value, property, options);
            } catch (e) {
                this.logger.error(ETCD_KEY_VALUE_ERROR(name), e);
            }

            const watcher = await this.etcd.watch().key(name).create();
            watcher.on('data', (res: RPC.IWatchResponse) => {
                res.events.forEach(evt => {
                    if (evt.type === 'Put') {
                        const value = evt.kv.value.toString();
                        setValue(target, value, property, options);
                    } else if (evt.type === 'Delete') {
                        setValue(target, '', property, options);
                    }
                });
            });
            watcher.on('error', e => this.logger.error(ETCD_KEY_VALUE_ERROR(name), e.message));
            item.watcher = watcher;
        }
    }
}
