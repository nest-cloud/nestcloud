import {
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';
import * as HttpProxy from 'http-proxy';
import { IProxy, ILoadbalance } from '@nestcloud/common';
import { get } from 'lodash';

import { Route } from './interfaces/route.interface';
import { Request } from './interfaces/request.interface';
import { Response } from './interfaces/response.interface';
import { ClientRequest, IncomingMessage } from 'http';
import { ProxyErrorException } from './exceptions/proxy-error.exception';
import { HEADER_TIMEOUT } from './proxy.constants';
import { ERROR_RESPONSE_FILTER, LOADBALANCE_FILTER } from './proxy.constants';
import { ProxyFilterRegistry } from './proxy-filter.registry';
import { ProxyRouteRegistry } from './proxy-route.registry';
import { URL } from 'url';
import { ProxyConfig } from './proxy.config';

export class Proxy implements IProxy, OnModuleInit {
    private proxy: HttpProxy;

    constructor(
        private readonly config: ProxyConfig,
        private readonly filterRegistry: ProxyFilterRegistry,
        private readonly routeRegistry: ProxyRouteRegistry,
        private readonly lb: ILoadbalance
    ) {
    }

    public async forward(req: Request, res: Response, id: string) {
        const route = this.routeRegistry.getRoute(id);
        if (!route) {
            throw new NotFoundException('No route config found in proxy config files, please check it.');
        }

        if (route.uri.indexOf('lb://') === 0) {
            return this.forwardLbRequest(req, res, route);
        } else if (route.uri.indexOf('http://') === 0 || route.uri.indexOf('https://') === 0) {
            return this.forwardRequest(req, res, route);
        }
    }

    onModuleInit(): any {
        this.initRoutes();
        this.initProxy();

        this.config.on(() => {
            if (this.proxy) {
                this.proxy.close();
            }
            this.initRoutes();
            this.initProxy();
        });
    }

    private initRoutes() {
        const routes: Route[] = this.config.getRoutes();
        routes.forEach(route => {
            if (!route.filters) {
                route.filters = [];
            }
            route.filters.push({ name: ERROR_RESPONSE_FILTER }, { name: LOADBALANCE_FILTER });
            route.filters = route.filters.filter(filter => filter.name);
            this.routeRegistry.addRoute(route.id, route);
            this.filterRegistry.addRouteFilters(route.id, route.filters);
        });
    }

    private initProxy() {
        this.proxy = HttpProxy.createProxyServer(
            Object.assign(this.config.getExtras() || {
                prependPath: true,
                ignorePath: true,
            }),
        );
        this.proxy.on('error', (err: Error, req: Request, res: Response) => {
            const filters = this.filterRegistry.getRouteFilters(get(req.proxy, 'id'));
            for (let i = 0; i < filters.length; i++) {
                const [routeFilter, filter] = filters[i];
                if (filter.error) {
                    req.proxy.parameters = routeFilter.parameters;
                    filter.error(err as ProxyErrorException, req, res);
                }
            }
        });
        this.proxy.on('proxyReq', (proxyReq: ClientRequest, req: Request, res: Response) => {
            const filters = this.filterRegistry.getRouteFilters(get(req.proxy, 'id'));
            for (let i = 0; i < filters.length; i++) {
                const [routeFilter, filter] = filters[i];
                if (filter.request) {
                    req.proxy.parameters = routeFilter.parameters;
                    filter.request(proxyReq, req, res);
                }
            }
        });
        this.proxy.on('proxyRes', (proxyRes: IncomingMessage, req: Request, res: Response) => {
            const filters = this.filterRegistry.getRouteFilters(get(req.proxy, 'id'));
            for (let i = 0; i < filters.length; i++) {
                const [routeFilter, filter] = filters[i];
                if (filter.response) {
                    req.proxy.parameters = routeFilter.parameters;
                    filter.response(proxyRes, req, res);
                }
            }
        });
    }

    private async forwardRequest(req: Request, res: Response, route: Route) {
        req.proxy = { uri: route.uri, id: route.id };
        await this.processBeforeFilter(req, res);

        const timeout = req.headers[HEADER_TIMEOUT] || 1000 * 30;
        const proxyTimeout = req.headers[HEADER_TIMEOUT] || 1000 * 30;
        const target = route.uri + req.url;
        const proxyOptions = route.extras || {};

        req.headers.host = new URL(target).host;
        this.proxy.web(req, res, {
            ...proxyOptions,
            target,
            timeout: Number(timeout),
            proxyTimeout: Number(proxyTimeout),
        });
    }

    private async forwardLbRequest(req: Request, res: Response, route: Route) {
        const service = route.uri.replace('lb://', '');
        if (!this.lb) {
            throw new InternalServerErrorException(`No lb module was found`);
        }
        const server = this.lb.choose(service);
        if (!server) {
            throw new InternalServerErrorException(`No available server can handle this request`);
        }
        req.proxy = {
            server,
            service,
            uri: route.uri,
            id: route.id,
        };
        await this.processBeforeFilter(req, res);

        const secure = get(route.extras, 'secure', false);
        const target = `${secure ? 'https' : 'http'}://${server.address}:${server.port}${req.url}`;
        const timeout = req.headers[HEADER_TIMEOUT] || 1000 * 30;
        const proxyTimeout = req.headers[HEADER_TIMEOUT] || 1000 * 30;
        const proxyOptions = route.extras || {};

        req.headers.host = new URL(target).host;
        this.proxy.web(req, res, {
            ...proxyOptions,
            target,
            prependPath: true,
            ignorePath: true,
            timeout: Number(timeout),
            proxyTimeout: Number(proxyTimeout),
        });
    }

    private async processBeforeFilter(req: Request, res: Response) {
        const filters = this.filterRegistry.getRouteFilters(get(req.proxy, 'id'));
        for (let i = 0; i < filters.length; i++) {
            const [routeFilter, filter] = filters[i];
            if (filter.before) {
                req.proxy.parameters = routeFilter.parameters;
                if (!(await filter.before(req, res))) {
                    throw new ForbiddenException('Forbidden');
                }
            }
        }
    }
}
