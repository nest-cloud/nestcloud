import { IServiceCheck } from './service-check.interface';

interface Proxy {
    destination_service_name?: string;
    destination_service_id?: string;
    local_service_address?: string;
    local_service_port?: number;
}

interface Upstream {
    upstreams: Proxy[];
}

export interface ConnectService {
    name?: string;
    kind?: string;
    checks?: IServiceCheck;
    proxy?: Proxy | Upstream;
}
