import { IHealthCheck } from "@nestcloud/feign";
import { Injectable } from "@nestjs/common";
import { HealthClient } from "./health.client";

@Injectable()
export class CustomCheck implements IHealthCheck {
    constructor(
        private readonly client: HealthClient
    ) {
    }

    async check(): Promise<void> {
        await this.client.checkHealth();
    }
}
