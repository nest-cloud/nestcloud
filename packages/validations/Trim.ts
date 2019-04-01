import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class Trim implements PipeTransform<any> {
    private readonly message: string;

    constructor(message?: string) {
        this.message = message || '';
    }

    async transform(value: any, metadata: ArgumentMetadata) {
        if (value && typeof value === 'string') {
            return value.trim();
        }
        return value;
    }
}
