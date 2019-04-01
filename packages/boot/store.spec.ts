import { Store } from './store';
import { expect } from 'chai';

describe('Boot Store', () => {
    beforeEach(async () => {
        process.env.TEST = 'test';
        Store.data = {
            test: '123',
            testEnv: '${{ TEST }}',
            testSelf: '${{ custom.data }}',
            custom: { data: '111' },
            testMultiExp: '${{ test }}:${{ testEnv }}'
        };
    });

    it(`Store.get()`, () => {
        expect(Store.get('test')).equal('123');
    });

    it(`Store.get() env value`, () => {
        expect(Store.get('testEnv')).equal('test');
    });

    it(`Store.get() self value`, () => {
        expect(Store.get('testSelf')).equal('111');
    });

    it(`Store.get() multi expressions`, () => {
        expect(Store.get('testMultiExp')).equal('123:test');
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
