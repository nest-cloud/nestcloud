import { Injectable } from "@nestjs/common";
import { InjectBoot, Boot } from "@nestcloud/boot";

@Injectable()
export class ConfigService {
    constructor(
        @InjectBoot() private readonly boot: Boot,
    ) {
    }

    getService(): string {
        return this.boot.get<string>('config.service.name', 'default-service');
    }
}
