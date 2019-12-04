import { IRbacAccount } from './rbac-account.interface';
import { IRbacConfig } from './rbac-config.interface';
import { IRbacData } from './rbac-data.interface';

export interface IRbacValidator {
    init(config: IRbacConfig, client?: any): void;

    validate(resource: string, verb: string, account: IRbacAccount): boolean;

    getData?(): IRbacData;
}
