import { ConsulService } from '@nestcloud/consul-service';
import { get, keyBy } from 'lodash';

import { RuleOptions } from './loadbalance.options';
import { Loadbalancer } from './loadbalancer';
import { Server } from './server';
import { ServerState } from './stats/server.state';

export class Loadbalance {
    private readonly service: ConsulService;
    private loadbalancers = {};
    private rules: RuleOptions[];
    private globalRuleCls: any;

    constructor(service: ConsulService) {
        this.service = service;
    }

    async init(rules: RuleOptions[], globalRuleCls) {
        this.rules = rules;
        this.globalRuleCls = globalRuleCls;

        const services = await this.service.getAllServices();
        await this.updateServices(services);

        this.service.onServiceListChange(async services => await this.updateServices(services))
    }

    chooseLoadbalancer(serviceName: string) {
        const loadbalancer = this.loadbalancers[serviceName];
        if (!loadbalancer) {
            throw new Error(`The service ${serviceName} is not exist`);
        }
        return loadbalancer;
    }

    choose(serviceName: string) {
        const loadbalancer = this.loadbalancers[serviceName];
        if (!loadbalancer) {
            throw new Error(`The service ${serviceName} is not exist`);
        }
        return loadbalancer.chooseService();
    }

    private async updateServices(services) {
        const ruleMap = keyBy(this.rules, 'service');
        for (const serviceId in services) {
            if (services.hasOwnProperty(serviceId)) {
                const nodes = services[serviceId];
                await this.addService(serviceId, nodes, get(ruleMap[serviceId], 'ruleCls', this.globalRuleCls));
            }
        }
    }

    private async addService(serviceName: string, nodes: any[], ruleCls: any) {
        if (!serviceName || this.loadbalancers[serviceName]) {
            return null;
        }

        this.createLoadbalancer(serviceName, nodes, ruleCls);
        this.createServiceWatcher(serviceName, ruleCls);
    }

    private createServiceWatcher(serviceName, ruleCls) {
        this.service.onServiceChange(serviceName, nodes => this.createLoadbalancer(serviceName, nodes, ruleCls));
    }

    private createLoadbalancer(serviceName, nodes, ruleCls) {
        const servers = nodes.map(node => {
            const server = new Server(node.address, node.port);
            server.name = node.name;
            server.state = new ServerState();
            server.state.status = node.status;
            return server;
        });

        this.loadbalancers[serviceName] = new Loadbalancer({ id: serviceName, servers, ruleCls });
    }
}
