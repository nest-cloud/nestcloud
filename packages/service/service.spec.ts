import { Service } from './service';
import * as Consul from 'consul';
import { expect } from 'chai';

describe('Consul Service Store', () => {
    let consul: Consul;
    let service: Service;

    before(async () => {
        consul = new Consul({ host: '127.0.0.1', port: 8500, promisify: true });
        await consul.agent.service.register({
            id: 'my-consul-service',
            name: 'my-consul-service',
            address: '127.0.0.1',
            port: 8500,
            check: {
                http: 'http://127.0.0.1:8500',
                interval: '5s',
            },
            status: 'passing',
        });
        service = new Service(consul, {
            discoveryHost: '127.0.0.1',
            healthCheck: {
                http: 'http://127.0.0.1:8500',
                interval: '5s',
            },
            service: {
                id: 'my-test-service',
                name: 'my-test-service',
                port: 8500,
            },
        });
        await service.init();
    });

    it(`service.onModuleInit()`, async () => {
        await service.onModuleInit();
        await new Promise(resolve => setTimeout(() => resolve(), 500));
        expect(service.getServiceNodes('my-test-service').length).equal(1);
    });

    it(`service.onModuleDestroy()`, async () => {
        await service.onModuleDestroy();
        await new Promise(resolve => setTimeout(() => resolve(), 500));
        expect(service.getServiceNodes('my-test-service').length).equal(0);
    });

    after(async () => {
        await consul.agent.service.deregister({ id: 'my-consul-service' });
    });
});
