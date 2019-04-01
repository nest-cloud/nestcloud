import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Validator } from 'class-validator';

@Injectable()
export class Default implements PipeTransform<any> {
    private readonly defaults: any;
    private readonly validator: Validator;

    constructor(defaults: any) {
        this.defaults = defaults;
        this.validator = new Validator();
    }

    async transform(value: any, metadata: ArgumentMetadata) {
        if (value === undefined) {
            return this.defaults;
        }
        return value;
    }
}
