import 'reflect-metadata';
import { NEST_LOADBALANCE, ILoadbalance, IServer } from '@nestcloud/common';
import * as CoreModule from '@nestcloud/core';

export const Choose = (service: string): PropertyDecorator => {
    return (target: any, propertyName: string | Symbol) => {
        const attributeName = propertyName as string;
        const coreModule: typeof CoreModule = require('@nestcloud/core');

        if (coreModule.NestCloud.global.loadbalance) {
            target[attributeName] = coreModule.NestCloud.global.loadbalance.choose(service);
        } else {
            coreModule.NestCloud.global.watch<ILoadbalance>(NEST_LOADBALANCE, loadbalance => {
                target[attributeName] = loadbalance.choose(service);
            });
        }

        Object.defineProperty(target, attributeName, {
            set: (server: IServer) => {
                return server;
            },
            get: () => {
                if (coreModule.NestCloud.global.loadbalance) {
                    return coreModule.NestCloud.global.loadbalance.choose(service);
                } else {
                    return target[attributeName];
                }
            }
        });
    };
};
