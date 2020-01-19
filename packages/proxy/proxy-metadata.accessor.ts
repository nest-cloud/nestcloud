import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FILTER_METADATA } from './proxy.constants';
import { Filter } from './interfaces/filter.interface';

@Injectable()
export class ProxyMetadataAccessor {
    constructor(
        private readonly reflector: Reflector,
    ) {
    }

    getFilters(target: Function): (Filter | Function)[] | undefined {
        return this.reflector.get(FILTER_METADATA, target);
    }
}
