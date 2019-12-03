import { IRbacRole } from './rbac-role.interface';
import { IRbacRoleBinding } from './rbac-role-binding.interface';
import { IRbacAccount } from './rbac-account.interface';

export interface IRbacData {
    roles: Map<string, IRbacRole>;
    roleBindings: Map<string, IRbacRoleBinding[]>;
    accounts: Map<string, IRbacAccount>;
}
