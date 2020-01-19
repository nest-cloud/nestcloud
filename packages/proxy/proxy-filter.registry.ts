import { Injectable } from '@nestjs/common';
import { Filter } from './interfaces/filter.interface';
import { RouteFilter } from './interfaces/route.interface';

@Injectable()
export class ProxyFilterRegistry {
    private readonly filters = new Map<string, Filter>();
    private readonly routeFilters = new Map<string, RouteFilter[]>();

    public addFilter(name: string, filter: Filter) {
        this.filters.set(name, filter);
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
}
