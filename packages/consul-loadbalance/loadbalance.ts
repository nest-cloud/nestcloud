import { ConsulService } from '@nestcloud/consul-service';
import { get, keyBy } from 'lodash';
import { ILoadbalance, IServiceNode } from '@nestcloud/common';

import { IRuleOptions } from './interfaces/rule-options.interface';
import { Loadbalancer } from './loadbalancer';
import { Server } from './server';
import { ServerState } from './server-state';
import { IRule } from "./interfaces/rule.interface";
import { ServiceNotExistException } from "./exceptions/service-not-exist.exception";

export class Loadbalance implements ILoadbalance {
    private readonly service: ConsulService;
    private loadbalancers = {};
    private rules: IRuleOptions[];
    private globalRuleCls: IRule | Function;

    constructor(service: ConsulService) {
        this.service = service;
    }

    async init(rules: IRuleOptions[], globalRuleCls) {
        this.rules = rules;
        this.globalRuleCls = globalRuleCls;

        const services: string[] = await this.service.getServiceNames();
        await this.updateServices(services);
        this.service.watchServiceList(async (services: string[]) => await this.updateServices(services));
    }

    chooseLoadbalancer(serviceName: string) {
        const loadbalancer = this.loadbalancers[serviceName];
        if (!loadbalancer) {
            throw new Error(`The service ${ serviceName } is not exist`);
        }
        return loadbalancer;
    }

    choose(serviceName: string) {
        const loadbalancer = this.loadbalancers[serviceName];
        if (!loadbalancer) {
            throw new ServiceNotExistException(`The service ${ serviceName } is not exist`);
        }
        return loadbalancer.chooseService();
    }

    private async updateServices(services: string[]) {
        const ruleMap = keyBy(this.rules, 'service');
        services.forEach(service => {
            const nodes = this.service.getServiceNodes(service);
            if (!service || this.loadbalancers[service]) {
                return null;
            }

            const ruleCls = get(ruleMap[service], 'ruleCls', this.globalRuleCls);
            this.createLoadbalancer(service, nodes, ruleCls);
            this.createServiceWatcher(service, ruleCls);
        });

    }

    private createServiceWatcher(service: string, ruleCls: IRule | Function) {
        this.service.watch(service, (nodes: IServiceNode[]) => this.createLoadbalancer(service, nodes, ruleCls));
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
