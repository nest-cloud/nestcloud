import { IRbacValidator } from './rbac-validator.interface';

export interface IRbacConfig {
    dependencies?: string[];
    backend?: string;
    validator?: IRbacValidator | Function;
    parameters?: { [key: string]: string };
}
