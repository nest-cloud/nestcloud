import { IRbacAccount } from './interfaces/rbac-account.interface';
import { IRbacRole } from './interfaces/rbac-role.interface';
import { IRbacRoleBinding } from './interfaces/rbac-role-binding.interface';
import * as YAML from 'yamljs';

export function parse(data): { accounts: IRbacAccount[], roles: IRbacRole[], roleBindings: IRbacRoleBinding[] } {
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
