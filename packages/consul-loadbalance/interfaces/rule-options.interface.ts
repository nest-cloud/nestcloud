export interface IRuleOptions {
    service: string;
    ruleCls: any;
    check?: {
        protocol?: string;
        url?: string;
    }
}
