import { IRbacRule } from './rbac-rule.interface';

export interface IRbacRole {
    name: string;
    rules: IRbacRule[];
}
