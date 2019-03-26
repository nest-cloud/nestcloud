import { Cache, NEST_COMMON } from '@nestcloud/common';
import { Module } from '@nestjs/core/injector/module';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';

export function chooseModule(metatype: Function) {
    const app = Cache.getInstance(NEST_COMMON).get('application');
    if (app) {
        const modules: Map<string, Module> = app.container.getModules();
        for (const module of modules.values()) {
            const instanceWrapper = module.injectables.get(metatype.name);
            if (instanceWrapper && module.injectables.has(metatype.name) && instanceWrapper.metatype === metatype) {
                return module;
            }
        }
    }

    return void 0;
}

export function getInstance(module: Module, metatype: Function) {
    const instanceWrapper: InstanceWrapper = module.injectables.get(metatype.name);
    if (instanceWrapper) {
        const instanceHost = instanceWrapper.getInstanceByContextId(STATIC_CONTEXT);
        if (instanceHost.isResolved && instanceHost.instance) {
            return instanceHost.instance;
        }
    }
}
