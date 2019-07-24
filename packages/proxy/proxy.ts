import { ForbiddenException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as HttpProxy from 'http-proxy';
import { IProxy, IConsulConfig, ILoadbalance } from '@nestcloud/common';
import { get } from 'lodash';

import { IRoute, IRouteFilter } from './interfaces/route.interface';
import { IExtraOptions } from './interfaces/extra-options.interface';
import { IRequest } from './interfaces/request.interface';
import { IResponse } from './interfaces/response.interface';
import { ClientRequest, IncomingMessage } from 'http';
import { IFilter } from './interfaces/filter.interface';
import { ProxyErrorException } from './exceptions/proxy-error.exception';
import { HEADER_TIMEOUT } from './constants';
import { AddRequestHeaderFilter, AddResponseHeaderFilter, ErrorResponseFilter, LoadbalanceFilter } from './filters';

export class Proxy implements IProxy {
    private readonly filters = new Map<string, IFilter>();
    private proxy: HttpProxy;
    private readonly proxyOptions: IExtraOptions;
    private readonly lb: ILoadbalance;
    protected readonly config: IConsulConfig;
    private routeMap = {};

    constructor(proxyOptions: IExtraOptions, lb: ILoadbalance, routes: IRoute[], config?: IConsulConfig) {
        this.lb = lb;
        this.config = config;
        this.proxyOptions = Object.assign({}, proxyOptions, {
            prependPath: true,
            ignorePath: true,
        });
        this.initDefaultFilters(routes);
        this.initProxy();
    }

    public registerFilter(filter: IFilter) {
        this.filters.set(filter.getName(), filter);
    }

    public updateRoutes(routes: IRoute[], sync: boolean = true) {
        this.routeMap = {};
        routes.forEach(route => (this.routeMap[route.id] = route));
        if (sync && this.config) {
            this.config.set('loadbalance.rules', routes);
        }
    }

    public async forward(req: IRequest, res: IResponse, id: string) {
        const route = this.routeMap[id] as IRoute;
        if (!route) {
            throw new NotFoundException('No route config found in proxy config files, please check it.');
        }
        if (!route.filters) {
            route.filters = [];
        }
        if (route.uri.indexOf('lb://') === 0) {
            return this.forwardLbRequest(req, res, route);
        } else if (route.uri.indexOf('http://') === 0 || route.uri.indexOf('https://') === 0) {
            return this.forwardRequest(req, res, route);
        }
    }

    private initDefaultFilters(routes: IRoute[]) {
        this.filters.set('ErrorResponseFilter', new ErrorResponseFilter());
        this.filters.set('LoadbalanceFilter', new LoadbalanceFilter());
        this.filters.set('AddRequestHeaderFilter', new AddRequestHeaderFilter());
        this.filters.set('AddResponseHeaderFilter', new AddResponseHeaderFilter());
        routes.forEach(route => {
            if (!route.filters) {
                route.filters = [];
            }
            route.filters.push({ name: 'ErrorResponseFilter' }, { name: 'LoadbalanceFilter' });
            this.routeMap[route.id] = route;
        });
    }

    private initProxy() {
        this.proxy = HttpProxy.createProxyServer(this.proxyOptions);
        this.proxy.on('error', async (err: Error, req: IRequest, res: IResponse) => {
            for (const filter of this.filters.values()) {
                if (filter.error) {
                    const id = get(req.proxy, 'id');
                    this.setParametersToReq(req, id, filter.getName());
                    await filter.error(err as ProxyErrorException, req, res);
                }
            }
        });
        this.proxy.on('proxyReq', async (proxyReq: ClientRequest, req: IRequest, res: IResponse) => {
            for (const filter of this.filters.values()) {
                if (filter.request) {
                    const id = get(req.proxy, 'id');
                    this.setParametersToReq(req, id, filter.getName());
                    await filter.request(proxyReq, req, res);
                }
            }
        });
        this.proxy.on('proxyRes', async (proxyRes: IncomingMessage, req: IRequest, res: IResponse) => {
            for (const filter of this.filters.values()) {
                if (filter.response) {
                    const id = get(req.proxy, 'id');
                    this.setParametersToReq(req, id, filter.getName());
                    await filter.response(proxyRes, req, res);
                }
            }
        });
    }

    private async forwardRequest(req: IRequest, res: IResponse, route: IRoute) {
        req.proxy = { uri: route.uri, id: route.id, filters: route.filters.map(filter => filter.name) };
        for (const filter of this.filters.values()) {
            if (filter.before) {
                this.setParametersToReq(req, route.id, filter.getName());
                if (!(await filter.before(req, res))) {
                    throw new ForbiddenException('Forbidden');
                }
            }
        }
        const timeout = req.headers[HEADER_TIMEOUT] || 1000 * 30;
        const proxyTimeout = req.headers[HEADER_TIMEOUT] || 1000 * 30;
        const target = route.uri + req.url;
        this.proxy.web(req, res, {
            target,
            timeout: Number(timeout),
            proxyTimeout: Number(proxyTimeout),
        });
    }

    private async forwardLbRequest(req: IRequest, res: IResponse, route: IRoute) {
        const service = route.uri.replace('lb://', '');
        const server = this.lb.choose(service);
        if (!server) {
            throw new InternalServerErrorException(`No available server can handle this request`);
        }
        req.proxy = {
            server,
            service,
            uri: route.uri,
            id: route.id,
            filters: route.filters.map(filter => filter.name),
        };
        for (const filter of this.filters.values()) {
            if (filter.before) {
                this.setParametersToReq(req, route.id, filter.getName());
                if (!(await filter.before(req, res))) {
                    throw new ForbiddenException('Forbidden');
                }
            }
        }
        const target = `${this.proxyOptions.secure ? 'https' : 'http'}://${server.address}:${server.port}${req.url}`;
        const timeout = req.headers[HEADER_TIMEOUT] || 1000 * 30;
        const proxyTimeout = req.headers[HEADER_TIMEOUT] || 1000 * 30;
        this.proxy.web(req, res, {
            target,
            prependPath: true,
            ignorePath: true,
            timeout: Number(timeout),
            proxyTimeout: Number(proxyTimeout),
        });
    }

    private setParametersToReq(req: IRequest, id: string, filter: string) {
        const filtersOptions: IRouteFilter[] = get(this.routeMap[id], 'filters', []);
        const filterOptions = filtersOptions.filter(opt => opt.name === filter)[0];
        if (filterOptions)
            req.proxy.parameters = filterOptions.parameters;
    }
}
