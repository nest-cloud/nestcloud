import { Injectable } from '@nestjs/common';
import { Route } from './interfaces/route.interface';

@Injectable()
export class ProxyRouteRegistry {
    private readonly routes = new Map<string, Route>();

    public addRoute(id: string, route: Route) {
        this.routes.set(id, route);
    }

    public addRoutes(routes: Route[]) {
        routes.forEach(route => {
            this.routes.set(route.id, route);
        });
    }

    public getRoute(id: string): Route {
        return this.routes.get(id);
    }
}
