export interface ServiceCheck {
    http?: string;
    tcp?: string;
    script?: string;
    interval?: string;
    timeout?: string;
    shell?: string;
    dockercontainerid?: string;
    ttl?: string;
    notes?: string;
    status?: string;
    deregistercriticalserviceafter?: string;
}
