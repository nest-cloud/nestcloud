import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Validator } from 'class-validator';

@Injectable()
export class Length implements PipeTransform<any> {
  private readonly length: number;
  private readonly message: string;
  private readonly validator: Validator;

  constructor(max: number, message?: string) {
    this.message = message || '';
    this.validator = new Validator();
    this.length = length;
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!this.validator.length(value, this.length)) {
      const { data } = metadata;
      const defaults = data ? `${data} is not valid` : 'Validation failed';
      throw new BadRequestException(this.message || defaults);
    }
    return value;
  }
}
