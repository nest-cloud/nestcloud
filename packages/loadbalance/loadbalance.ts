import {
    ILoadbalance,
    IServiceServer,
    IServer,
    ILoadbalancer,
    IService,
    Scanner,
    SERVICE,
    stringToKeyValue,
} from '@nestcloud/common';
import { ServiceOptions } from './interfaces/service-options.interface';
import { Loadbalancer } from './loadbalancer';
import { Server } from './server';
import { ServerState } from './server-state';
import { Rule } from './interfaces/rule.interface';
import { ServiceNotExistException } from './exceptions/service-not-exist.exception';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { LoadbalanceChecker } from './loadbalance.checker';
import { LoadbalanceRuleRegistry } from './loadbalance-rule.registry';
import { LoadbalanceConfig } from './loadbalance.config';

@Injectable()
export class Loadbalance implements ILoadbalance, OnModuleInit {
    private readonly loadbalancers = new Map<string, Loadbalancer>();
    private timer = null;

    constructor(
        private readonly config: LoadbalanceConfig,
        private readonly scanner: Scanner,
        private readonly loadbalanceChecker: LoadbalanceChecker,
        private readonly loadbalanceRuleRegistry: LoadbalanceRuleRegistry,
        @Inject(SERVICE) private readonly service: IService,
    ) {
    }

    async onModuleInit(): Promise<void> {
        await this.init();
    }

    private async init() {
        const services: string[] = this.service.getServiceNames();
        await this.updateServices(services);
        this.service.watchServiceList(async (services: string[]) => {
            await this.updateServices(services);
        });

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

    private updateServices(services: string[], force?: boolean) {
        services.forEach(async service => {
            const nodes = this.service.getServiceServers(service);
            if (!force) {
                if (!service || this.loadbalancers.has(service)) {
                    return null;
                }
            }

            const ruleName = this.config.getRule(service);
            let rule: Rule = this.loadbalanceRuleRegistry.getRule(ruleName);
            if (!rule) {
                await new Promise((resolve, reject) => {
                    this.loadbalanceRuleRegistry.watch(() => {
                        rule = this.loadbalanceRuleRegistry.getRule(ruleName);
                        if (rule) {
                            resolve();
                        }
                    });
                    setTimeout(() => reject(new Error(`The rule ${ruleName} is not exist`)), 5000);
                });
            }
            this.createLoadbalancer(service, nodes, rule);
            this.createServiceWatcher(service, rule);
        });
    }

    private createServiceWatcher(service: string, rule: Rule) {
        this.service.watch(service, (nodes: IServiceServer[]) => this.createLoadbalancer(service, nodes, rule));
    }

    private createLoadbalancer(serviceName: string, nodes: IServiceServer[], rule: Rule) {
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
            server.tags = stringToKeyValue(node.tags);
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
            const servicesOptions = this.config.getServiceOptions();
            const options: ServiceOptions = servicesOptions.filter(rule => rule.name === service)[0];
            this.loadbalanceChecker.pingServer(loadbalancer, options);
        });
    }
}
