import { Injectable } from '@nestjs/common';

@Injectable()
export class BrakesRegistry {
    private readonly brakes = new Map<string, any>();

    addBrakes(name: string, brakes: any) {
        this.brakes.set(name, brakes);
    }

    getBrakes(name: string) {
        return this.brakes.get(name);
    }
}
