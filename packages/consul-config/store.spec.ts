import { Store } from "./store";
import { expect } from 'chai';

describe('Consul Config Store', () => {
    beforeEach(async () => {
        Store.data = { test: '123' };
    });

    it(`Store.get()`, () => {
        expect(Store.get('test')).equal('123');
    });

    it(`Store.get() default value`, () => {
        expect(Store.get('none', 'defaults')).equal('defaults');
    });

    it(`Store.watch()`, async () => {
        const data = await new Promise((resolve, reject) => {
            Store.watch('data', data => {
                resolve(data);
            });
            Store.data = { data: '123' };
        });
        expect(data).equal('123');
    });

    afterEach(async () => {
    });
});
