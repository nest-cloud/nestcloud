import { get } from 'lodash';
import { IRbacValidator } from './interfaces/rbac-validator.interface';
import { IRbacAccount } from './interfaces/rbac-account.interface';
import { parse } from './parser';
import { Store } from './store';
import { IRbacConfig } from './interfaces/rbac-config.interface';
import { Backend } from './constants';
import { BackendMismatchException } from './exceptions/backend-mismatch.exception';
import { IKubernetes } from '@nestcloud/common';

export class KubeValidator implements IRbacValidator {
    private readonly store: Store = new Store();
    private client: IKubernetes;

    public validate(resource: string, verb: string, account: IRbacAccount): boolean {
        return this.store.validate(account.name, resource, verb);
    }

    public async init(config: IRbacConfig, client?: IKubernetes) {
        if (config.backend !== Backend.KUBERNETES) {
            throw new BackendMismatchException(`The KubeValidator need backend is Backend.KUBERNETES`);
        }
        this.client = client;
        const path = config.parameters.path;
        const name = config.parameters.name;
        const namespace = config.parameters.namespace;
        if (path && name && namespace) {
            await this.watch(name, namespace, path);
        }
    }

    private async watch(name: string, namespace: string, path: string) {
        const result = await this.client.api.v1.namespaces(namespace).configmaps(name).get();
        const data = get(result, 'body.data', { [path]: '' });
        const { accounts, roles, roleBindings } = parse(data[path]);
        this.store.init(accounts, roles, roleBindings);

        const events = await (this.client.api.v1.watch.namespaces(namespace).configmaps(name) as any).getObjectStream();
        events.on('data', event => {
            if (event.type === 'ADDED' || event.type === 'MODIFIED') {
                const data = get(event, 'object.data', { [path]: '' });
                const { accounts, roles, roleBindings } = parse(data[path]);
                this.store.init(accounts, roles, roleBindings);
            }
        });
    }
}
