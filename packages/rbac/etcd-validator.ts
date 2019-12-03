import { IRbacValidator } from './interfaces/rbac-validator.interface';
import { IRbacAccount } from './interfaces/rbac-account.interface';
import { parse } from './parser';
import { Store } from './store';
import { IRbacConfig } from './interfaces/rbac-config.interface';
import { Backend } from './constants';
import { BackendMismatchException } from './exceptions/backend-mismatch.exception';
import { IEtcd } from '@nestcloud/common';
import * as RPC from 'etcd3/lib/src/rpc';

export class EtcdValidator implements IRbacValidator {
    private readonly store: Store = new Store();
    private client: IEtcd;

    public validate(resource: string, verb: string, account: IRbacAccount): boolean {
        return this.store.validate(account.name, resource, verb);
    }

    public async init(config: IRbacConfig, client?: IEtcd) {
        if (config.backend !== Backend.ETCD) {
            throw new BackendMismatchException(`The EtcdValidator need backend is Backend.ETCD`);
        }
        this.client = client;
        const key = config.parameters.key;
        const namespace = config.parameters.namespace;
        if (key) {
            await this.watch(key, namespace);
        }
    }

    private async watch(key: string, namespace: string) {
        const data = await this.client.namespace(namespace).get(key).string();
        if (data) {
            const { accounts, roles, roleBindings } = parse(data);
            this.store.init(accounts, roles, roleBindings);
        }

        const watcher = await this.client.namespace(namespace).watch().key(key).create();
        watcher.on('data', (res: RPC.IWatchResponse) => {
            const event = res.events.filter(evt => !evt.prev_kv)[0];
            if (event) {
                if (event.type === 'Delete') {
                    this.store.reset();
                } else if (event.type === 'Put') {
                    if (event.kv.value && event.kv.value.toString()) {
                        const { accounts, roles, roleBindings } = parse(event.kv.value.toString());
                        this.store.init(accounts, roles, roleBindings);
                    }
                }
            }
        });
    }
}
