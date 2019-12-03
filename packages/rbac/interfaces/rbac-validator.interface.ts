import { IRbacAccount } from './rbac-account.interface';
import { IRbacConfig } from './rbac-config.interface';

export interface IRbacValidator {
    init(config: IRbacConfig, client?: any): void;

    validate(resource: string, verb: string, account: IRbacAccount): boolean;
}
