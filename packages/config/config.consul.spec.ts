import * as Consul from 'consul';
import { ConsulConfig } from './config.consul';
import { expect } from 'chai';
import { ConfigStore } from './config.store';

describe('Consul Config Store', () => {
    const configKey = 'test-config';
    const config = `
web:
  service: user-service
  port: 3000
    `;
    let consul;
    let consulConfig: ConsulConfig;
    before(async () => {
        consul = new Consul({ host: '127.0.0.1', port: '8500', promisify: true });
        await consul.kv.set(configKey, config);
        consulConfig = new ConsulConfig(new ConfigStore(), consul, configKey);
        await consulConfig.onModuleInit();
    });

    it(`consulConfig.get()`, () => {
        expect(consulConfig.get<number>('web.port')).equal(3000);
    });

    it(`consulConfig.set()`, async () => {
        await consulConfig.set('web.port', 4000);
        expect(consulConfig.get<number>('web.port')).equal(4000);
    });

    it(`consulConfig.watch()`, async () => {
        const data = await new Promise((resolve, reject) => {
            consulConfig.watch<string>('web.serviceName', serviceName => resolve(serviceName));
            consulConfig.set('web.serviceName', 'new-user-service');
        });
        expect(data).equal('new-user-service');
    });

    after(async () => {
        await consul.kv.del(configKey);
    });
});
