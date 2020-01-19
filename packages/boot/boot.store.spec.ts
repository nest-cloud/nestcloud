import { BootStore } from './boot.store';
import { expect } from 'chai';

describe('Boot Store', () => {
    before(() => {
        this.store = new BootStore();
    });

    beforeEach(async () => {
        process.env.TEST = 'test';
        this.store.data = {
            test: '123',
            testEnv: '${{ TEST }}',
            testSelf: '${{ custom.data }}',
            custom: { data: '111' },
            testMultiExp: '${{ test }}:${{ testEnv }}',
        };
    });

    it(`Store.get()`, () => {
        expect(this.store.get('test')).equal('123');
    });

    it(`Store.get() env value`, () => {
        expect(this.store.get('testEnv')).equal('test');
    });

    it(`Store.get() self value`, () => {
        expect(this.store.get('testSelf')).equal('111');
    });

    it(`Store.get() multi expressions`, () => {
        expect(this.store.get('testMultiExp')).equal('123:test');
    });

    it(`Store.get() default value`, () => {
        expect(this.store.get('none', 'defaults')).equal('defaults');
    });

    it(`Store.watch()`, async () => {
        const data = await new Promise((resolve, reject) => {
            this.store.watch('data', data => {
                resolve(data);
            });
            this.store.data = { data: '123' };
        });
        expect(data).equal('123');
    });

    afterEach(async () => {
    });
});
