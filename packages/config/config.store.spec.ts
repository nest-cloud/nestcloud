import { ConfigStore } from './store';
import { expect } from 'chai';

describe('Consul Config Store', () => {
    beforeEach(async () => {
        ConfigStore.data = { test: '123' };
    });

    it(`Store.get()`, () => {
        expect(ConfigStore.get('test')).equal('123');
    });

    it(`Store.get() default value`, () => {
        expect(ConfigStore.get('none', 'defaults')).equal('defaults');
    });

    it(`Store.watch()`, async () => {
        const data = await new Promise((resolve, reject) => {
            ConfigStore.watch('data', data => {
                resolve(data);
            });
            ConfigStore.data = { data: '123' };
        });
        expect(data).equal('123');
    });

    afterEach(async () => {});
});
