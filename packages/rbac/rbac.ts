import { IRbacConfig } from "./interfaces/rbac-config.interface";
import { IRbacValidator } from "./interfaces/rbac-validator.interface";

export class Rbac {

    constructor(
        private readonly config: IRbacConfig,
        private readonly validator: IRbacValidator,
    ) {
    }


    public async init(client: any) {
        await this.validator.init(this.config, client);
    }

    public getValidator(): IRbacValidator {
        return this.validator;
    }
}
