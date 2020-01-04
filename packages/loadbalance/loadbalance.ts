import { ILoadbalance, IServiceNode, IServer, ILoadbalancer, IService, Scanner, SERVICE } from '@nestcloud/common';
import { ServiceOptions } from './interfaces/service-options.interface';
import { Loadbalancer } from './loadbalancer';
import { Server } from './server';
import { ServerState } from './server-state';
import { Rule } from './interfaces/rule.interface';
import { ServiceNotExistException } from './exceptions/service-not-exist.exception';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { LoadbalanceOptions } from './interfaces/loadbalance-options.interface';
import { LOADBALANCE_OPTIONS_PROVIDER } from './loadbalance.constants';
import { RandomRule } from './rules';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';
import { LoadbalanceChecker } from './loadbalance.checker';

@Injectable()
export class Loadbalance implements ILoadbalance, OnApplicationBootstrap {
    private options: LoadbalanceOptions = {};
    private readonly loadbalancers = new Map<string, Loadbalancer>();
    private globalRule: Rule;
    private serviceRules = new Map<string, Rule>();
    private timer = null;

    constructor(
        @Inject(LOADBALANCE_OPTIONS_PROVIDER) private readonly registerOptions: LoadbalanceOptions,
        private readonly scanner: Scanner,
        private readonly loadbalanceChecker: LoadbalanceChecker,
        @Inject(SERVICE) private readonly service: IService,
    ) {
    }

    async onApplicationBootstrap(): Promise<void> {
        this.initRules();
        await this.init();
    }

    private initRules() {
        const contextName = this.scanner.findContextModuleName(Loadbalance.constructor);
        if (!contextName) {
            this.globalRule = new RandomRule();
            return;
        }
        const globalRuleName = this.options.rule || 'RandomRule';
        const instanceWrapper = this.scanner.findInstance(contextName, globalRuleName);
        if (instanceWrapper) {
            const instanceHost = instanceWrapper.getInstanceByContextId(STATIC_CONTEXT);
            let rule = instanceHost && instanceHost.instance;
            if (!rule) {
                rule = new RandomRule();
            }
            this.globalRule = rule;
        } else {
            this.globalRule = new RandomRule();
        }

        if (this.options.services) {
            this.options.services.forEach(opts => {
                const instanceWrapper = this.scanner.findInstance(contextName, opts.rule);
                if (!instanceWrapper) {
                    return null;
                }
                const instanceHost = instanceWrapper.getInstanceByContextId(STATIC_CONTEXT);
                const rule = instanceHost && instanceHost.instance;
                this.serviceRules.set(opts.name, rule);
            });
        }
    }

    private async init() {
        const services: string[] = this.service.getServiceNames();
        await this.updateServices(services);
        this.service.watchServiceList((services: string[]) => this.updateServices(services));

        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(() => this.pingServers(), 30000);
    }

    public chooseLoadbalancer(serviceName: string): ILoadbalancer {
        const loadbalancer = this.loadbalancers.get(serviceName);
        if (!loadbalancer) {
            throw new Error(`The service ${serviceName} is not exist`);
        }
        return loadbalancer;
    }

    public choose(serviceName: string): IServer {
        const loadbalancer = this.loadbalancers.get(serviceName);
        if (!loadbalancer) {
            throw new ServiceNotExistException(`The service ${serviceName} is not exist`);
        }
        return loadbalancer.chooseService();
    }

    public state(): { [service: string]: IServer[] } {
        const state = {};
        this.loadbalancers.forEach((loadbalancer, service) => {
            state[service] = loadbalancer.servers;
        });
        return state;
    }

    private updateServices(services: string[]) {
        services.forEach(service => {
            const nodes = this.service.getServiceNodes(service);
            if (!service || this.loadbalancers.has(service)) {
                return null;
            }

            const rule: Rule = this.serviceRules[service] || this.globalRule;
            this.createLoadbalancer(service, nodes, rule);
            this.createServiceWatcher(service, rule);
        });
    }

    private createServiceWatcher(service: string, rule: Rule) {
        this.service.watch(service, (nodes: IServiceNode[]) => this.createLoadbalancer(service, nodes, rule));
    }

    private createLoadbalancer(serviceName: string, nodes: IServiceNode[], rule: Rule) {
        const loadbalancer: Loadbalancer = this.loadbalancers.get(serviceName);
        const servers = nodes.map(node => {
            const server = new Server(node.address, node.port);
            server.name = node.name;
            if (loadbalancer && loadbalancer.getServer(server.id)) {
                server.state = loadbalancer.getServer(server.id).state;
            } else {
                server.state = new ServerState();
            }
            server.state.status = node.status;
            return server;
        });

        this.loadbalancers.set(serviceName, new Loadbalancer(
            serviceName,
            serviceName,
            servers,
            rule,
        ));
    }

    private pingServers() {
        this.loadbalancers.forEach((loadbalancer, service) => {
            const servicesOptions = this.options.services || [];
            const options: ServiceOptions = servicesOptions.filter(rule => rule.name === service)[0];
            this.loadbalanceChecker.pingServer(loadbalancer, options);
        });
    }
}
