import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Validator } from 'class-validator';

export interface ValidationOption {
    message: string;
}

@Injectable()
export class Validation implements PipeTransform<any> {
    async transform(value, metadata: ArgumentMetadata) {
        const { metatype } = metadata;
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new BadRequestException('Validation failed');
        }
        return value;
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find(type => metatype === type);
    }
}

export class BaseValidationPipe {
    protected readonly message: string;
    protected validator: Validator;

    constructor(options?: ValidationOption) {
        if (options) {
            this.message = options.message || 'Validation failed';
        }

        this.validator = new Validator();
    }

    protected handleInvalid(metadata) {
        const { data } = metadata;
        const defaults = data ? `${data} cannot be empty` : 'Validation failed';
        throw new BadRequestException(this.message || defaults);
    }
}

@Injectable()
export class IsNotEmpty extends BaseValidationPipe implements PipeTransform<string> {
    async transform(value: string, metadata: ArgumentMetadata) {
        if (!value) {
            this.handleInvalid(metadata);
        }
        return value;
    }
}

@Injectable()
export class IsArray extends BaseValidationPipe implements PipeTransform<any[]> {
    async transform(value: any[], metadata: ArgumentMetadata) {
        if (!this.validator.isArray(value)) {
            this.handleInvalid(metadata);
        }
        return value;
    }
}
