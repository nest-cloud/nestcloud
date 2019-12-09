import { IRbacData } from './interfaces/rbac-data.interface';
import { IRbacAccount } from './interfaces/rbac-account.interface';
import { IRbacRole } from './interfaces/rbac-role.interface';
import { IRbacRoleBinding } from './interfaces/rbac-role-binding.interface';

export class Store {
    private readonly data: IRbacData = {
        accounts: new Map<string, IRbacAccount>(),
        roles: new Map<string, IRbacRole>(),
        roleBindings: new Map<string, IRbacRoleBinding[]>(),
    };

    public init(accounts: IRbacAccount[], roles: IRbacRole[], roleBindings: IRbacRoleBinding[]) {
        this.reset();
        accounts.forEach(account => this.setAccount(account));
        roles.forEach(role => this.setRole(role));
        roleBindings.forEach(roleBinding => this.setRoleBinding(roleBinding));
    }

    public getData(): IRbacData {
        return this.data;
    }

    public validate(account: string, resource: string, verb: string): boolean {
        if (!this.data.accounts.has(account)) {
            return false;
        }
        if (!this.data.roleBindings.has(account)) {
            return false;
        }

        const roleBindings = this.data.roleBindings.get(account);
        if (roleBindings.length === 0) {
            return false;
        }
        for (let i = 0; i < roleBindings.length; i++) {
            const roleName: string = roleBindings[i].role;
            if (this.data.roles.has(roleName)) {
                const role: IRbacRole = this.data.roles.get(roleName);
                const hasRule = role.rules.filter(rule => {
                    const hasResource = rule.resources.includes(resource) || rule.resources.includes('*');
                    const hasVerb = rule.verbs.includes(verb) || rule.verbs.includes('*');
                    return hasResource && hasVerb;
                }).length !== 0;
                if (hasRule) {
                    return true;
                }
            }
        }

        return false;
    }

    public setRole(role: IRbacRole) {
        this.data.roles.set(role.name, role);
    }

    public setAccount(account: IRbacAccount) {
        this.data.accounts.set(account.name, account);
    }

    public setRoleBinding(roleBinding: IRbacRoleBinding) {
        roleBinding.accounts.forEach(accountName => {
            const roleBindings = this.data.roleBindings.get(accountName) || [];

            this.data.roleBindings.set(accountName, [...roleBindings, roleBinding]);
        });
    }

    public deleteRoleBinding(account: string) {
        this.data.roleBindings.delete(account);
    }

    public deleteAccount(account: string) {
        this.data.accounts.delete(account);
        this.deleteRoleBinding(account);
    }

    public deleteRole(role: string) {
        this.data.roles.delete(role);
    }

    public reset() {
        this.data.accounts = new Map<string, IRbacAccount>();
        this.data.roles = new Map<string, IRbacRole>();
        this.data.roleBindings = new Map<string, IRbacRoleBinding[]>();
    }
}
