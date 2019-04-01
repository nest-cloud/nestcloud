import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Validator } from 'class-validator';

@Injectable()
export class NotEquals implements PipeTransform<any> {
    private readonly message: string;
    private readonly comparison: any;
    private readonly validator: Validator;

    constructor(comparison: any, message?: string) {
        this.message = message || '';
        this.comparison = comparison;
        this.validator = new Validator();
    }

    async transform(value: any, metadata: ArgumentMetadata) {
        if (!this.validator.notEquals(value, this.comparison)) {
            const { data } = metadata;
            const defaults = data ? `${data} is not valid` : 'Validation failed';
            throw new BadRequestException(this.message || defaults);
        }
        return value;
    }
}
