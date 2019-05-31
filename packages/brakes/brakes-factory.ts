import * as Brakes from 'brakes';
import { IBrakesConfig } from "./interfaces/brakes-config.interface";
import { NotFoundBrakesException } from "./exceptions/not-found-brakes.exception";
import { HttpException } from "@nestjs/common";

export class BrakesFactory {
    private static brakesMap = new Map<string, Brakes>();

    static isInit(service: string): boolean {
        return this.brakesMap.has(service);
    }

    static initBrakes(service: string, config: IBrakesConfig): Brakes {
        const brakes = new Brakes(config);
        this.brakesMap.set(service, brakes);
        return brakes;
    }

    static async exec(service: string, call: Function, ...params) {
        const brakes = this.brakesMap.get(service);
        if (!brakes) {
            throw new NotFoundBrakesException(`Cannot find brakes for ${ service }`);
        }

        let httpException = null;
        const executor = brakes.slaveCircuit(async (...params) => {
            try {
                return await call(...params);
            } catch (e) {
                if (e instanceof HttpException) {
                    httpException = e;
                } else {
                    throw e;
                }
            }
        });
        if (httpException) {
            throw httpException;
        }
        return await executor.exec(params);
    }
}
