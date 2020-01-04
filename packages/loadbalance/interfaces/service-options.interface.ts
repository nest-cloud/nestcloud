export interface ServiceOptions {
    name: string;
    rule: string;
    check?: {
        protocol?: string;
        url?: string;
    };
}
