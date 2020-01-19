import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { AppModule } from '../src/app.module';
import { BOOT, IBoot } from '../../../packages/common';

describe('Boot Module', () => {
    let testingModule: TestingModule;

    beforeEach(async () => {
        process.env.SERVICE = 'test-service';
        const builder = Test.createTestingModule({
            imports: [AppModule],
        });
        testingModule = await builder.compile();
    });

    it('should get boot config with given path as boot module', () => {
        const boot = testingModule.get<IBoot>(BOOT);
        expect(boot.get<number>('web.port', 3333)).to.be.eq(3000);
        expect(boot.get<number>('web.extra', 3333)).to.be.eq(3333);
    });

    it('should get boot config with template compiling as boot module', () => {
        const boot = testingModule.get<IBoot>(BOOT);
        expect(boot.get<string>('web.service')).to.be.eq('test-service');
        expect(boot.get<string>('web.address')).to.be.eq('http://test-service:3000');
    });

    it('should get boot all configs without given path as boot module', () => {
        const boot = testingModule.get<IBoot>(BOOT);
        const expectData = {
            web: {
                service: 'test-service',
                port: 3000,
                address: 'http://test-service:3000',
            },
        };
        expect(JSON.stringify(boot.get())).to.be.eq(JSON.stringify(expectData));
    });
});
