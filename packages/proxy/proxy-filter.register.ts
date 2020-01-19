import { Injectable } from '@nestjs/common';
import { UseFilters } from './decorators/use-filters.decorator';
import { ErrorResponseFilter } from './filters/error-response.filter';
import { ResponseHeaderFilter } from './filters/response-header.filter';
import { RequestHeaderFilter } from './filters/request-header.filter';
import { LoadbalanceFilter } from './filters/loadbalance.filter';

@Injectable()
@UseFilters(ErrorResponseFilter, LoadbalanceFilter, RequestHeaderFilter, ResponseHeaderFilter)
export class ProxyFilterRegister {
}
