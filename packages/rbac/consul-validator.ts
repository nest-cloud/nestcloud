import { IRbacValidator } from './interfaces/rbac-validator.interface';
import { IRbacAccount } from './interfaces/rbac-account.interface';
import * as Consul from 'consul';
import { Store } from './store';
import { IRbacConfig } from './interfaces/rbac-config.interface';
import { Backend } from './constants';
import { BackendMismatchException } from './exceptions/backend-mismatch.exception';
import { parse } from './parser';

export class ConsulValidator implements IRbacValidator {
    private readonly store: Store = new Store();
    private consul: Consul;

    public validate(resource: string, verb: string, account: IRbacAccount): boolean {
        return this.store.validate(account.name, resource, verb);
    }

    public async init(config: IRbacConfig, client?: Consul) {
        if (config.backend !== Backend.CONSUL) {
            throw new BackendMismatchException(`The ConsulValidator need backend is Backend.CONSUL`);
        }
        this.consul = client;
        const name = config.parameters.name;
        if (name) {
            await this.watch(name);
        }
    }

    private async watch(name: string) {
        const data = await this.consul.kv.get(name);
        if (data && data.Value) {
            const { accounts, roles, roleBindings } = parse(data.Value);
            this.store.init(accounts, roles, roleBindings);
        }

        const watcher = this.consul.watch({
            method: this.consul.kv.get,
            options: { name, timeout: 5 * 60 * 1000 },
        });
        watcher.on('change', data => {
            if (data && data.Value) {
                const { accounts, roles, roleBindings } = parse(data.Value);
                this.store.init(accounts, roles, roleBindings);
            }
        });
        watcher.on('error', e => void 0);
    }
}
