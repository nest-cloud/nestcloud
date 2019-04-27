import { IRbacValidator } from "./interfaces/rbac-validator.interface";
import { IRbacAccount } from "./interfaces/rbac-account.interface";
import * as Consul from 'consul';
import * as YAML from 'yamljs';
import { IRbacRole } from "./interfaces/rbac-role.interface";
import { IRbacRoleBinding } from "./interfaces/rbac-role-binding.interface";
import { Store } from "./store";
import { IRbacConfig } from "./interfaces/rbac-config.interface";
import { Backend } from "./constants";
import { BackendMismatchException } from "./exceptions/backend-mismatch.exception";

export class ConsulValidator implements IRbacValidator {
    private readonly store: Store = new Store();
    private consul: Consul;

    public validate(resource: string, verb: string, account: IRbacAccount): boolean {
        return this.store.validate(account.name, resource, verb);
    }

    public async init(config: IRbacConfig, client: Consul) {
        if (config.backend !== Backend.CONSUL) {
            throw new BackendMismatchException(`The ConsulValidator need backend is Backend.CONSUL`);
        }
        this.consul = client;
        const data = await this.consul.kv.get(config.key);
        if (data && data.Value) {
            const { accounts, roles, roleBindings } = this.parse(data.Value);
            this.store.init(accounts, roles, roleBindings);
        }

        const watcher = this.consul.watch({
            method: this.consul.kv.get,
            options: { key: config.key, timeout: 5 * 60 * 1000 }
        });
        watcher.on('change', data => {
            if (data && data.Value) {
                const { accounts, roles, roleBindings } = this.parse(data.Value);
                this.store.init(accounts, roles, roleBindings);
            }
        });
        watcher.on('error', e => void 0);
    }

    private parse(data): { accounts: IRbacAccount[], roles: IRbacRole[], roleBindings: IRbacRoleBinding[] } {
        const chunks = data.split('---');
        const roles: IRbacRole[] = [];
        const accounts: IRbacAccount[] = [];
        const roleBindings: IRbacRoleBinding[] = [];
        chunks.forEach(chunk => {
            const data = YAML.parse(chunk);
            switch (data.kind) {
                case 'Role':
                    roles.push(data);
                    break;
                case 'Account':
                    accounts.push(data);
                    break;
                case 'RoleBinding':
                    roleBindings.push(data);
            }
        });

        return { accounts, roleBindings, roles };
    }
}
