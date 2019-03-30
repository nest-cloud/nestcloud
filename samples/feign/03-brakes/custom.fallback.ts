import { IFallback } from "@nestcloud/feign";
import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { AxiosResponse } from "axios";

@Injectable()
export class CustomFallback implements IFallback {
    fallback(): Promise<AxiosResponse | void> | AxiosResponse | void {
        throw new ServiceUnavailableException('The service is unavailable, please retry soon.');
    }
}
