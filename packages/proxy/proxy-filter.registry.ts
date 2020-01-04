import { Injectable, OnModuleInit } from '@nestjs/common';
import { Filter } from './interfaces/filter.interface';
import {
    ERROR_RESPONSE_FILTER,
    LOADBALANCE_FILTER,
    REQUEST_HEADER_FILTER,
    RESPONSE_HEADER_FILTER,
} from './proxy.constants';
import { ErrorResponseFilter, LoadbalanceFilter, RequestHeaderFilter, ResponseHeaderFilter } from './filters';
import { RouteFilter } from './interfaces/route.interface';

@Injectable()
export class ProxyFilterRegistry implements OnModuleInit {
    private readonly filters = new Map<string, Filter>();
    private readonly routeFilters = new Map<string, RouteFilter[]>();

    constructor(
        private readonly errorResponseFilter: ErrorResponseFilter,
        private readonly loadbalanceFilter: LoadbalanceFilter,
        private readonly requestHeaderFilter: RequestHeaderFilter,
        private readonly responseHeaderFilter: ResponseHeaderFilter,
    ) {
    }

    public addFilter(name: string, filter: Filter) {
        if (!this.filters.has(name)) {
            this.filters.set(name, filter);
        }
    }

    public addRouteFilters(id: string, routeFilters: RouteFilter[]) {
        this.routeFilters.set(id, routeFilters);
    }

    public addRouteFilter(id: string, routeFilter: RouteFilter) {
        const routeFilters = this.routeFilters.get(id) || [];
        routeFilters.push(routeFilter);
        this.routeFilters.set(id, routeFilters);
    }

    public getFilter(name: string): Filter | undefined {
        return this.filters.get(name);
    }

    public getRouteFilters(id: string): ([RouteFilter, Filter])[] {
        const routeFilters = this.routeFilters.get(id);
        if (!routeFilters) {
            return [];
        }
        const result = [];
        routeFilters.forEach(routeFilter => {
            const filter = this.filters.get(routeFilter.name);
            if (filter) {
                result.push([routeFilter, filter]);
            }
        });
        return result;
    }

    onModuleInit(): any {
        this.initDefaultFilters();
    }

    private initDefaultFilters() {
        this.filters.set(ERROR_RESPONSE_FILTER, this.errorResponseFilter);
        this.filters.set(LOADBALANCE_FILTER, this.loadbalanceFilter);
        this.filters.set(REQUEST_HEADER_FILTER, this.requestHeaderFilter);
        this.filters.set(RESPONSE_HEADER_FILTER, this.responseHeaderFilter);
    }
}
