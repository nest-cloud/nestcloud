import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { TestClient } from '../src/test.client';
import { AxiosResponse } from 'axios';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('Http Module Request Params', () => {
    let testingModule: TestingModule;
    let testClient: TestClient;
    let app: INestApplication;

    beforeEach(async () => {
        const builder = Test.createTestingModule({
            imports: [AppModule],
        });
        testingModule = await builder.compile();
        app = testingModule.createNestApplication();
        await app.init();
        testClient = app.get<TestClient>(TestClient);
    });

    afterEach(async () => {
        await app.close();
    });

    it('should send request with request params', async () => {
        const response: AxiosResponse = await testClient.requestForParamsTest(
            'location',
            'appKey',
            'data',
            'header',
        );
        expect(response.config.url).to.be.eq('https://api.jisuapi.com/ip/location');
        expect(response.config.params.appKey).to.be.eq('appKey');
        expect(response.config.data).to.be.eq('{"data":"data"}');
        expect(response.config.headers['test-header']).to.be.eq('header');
    });

    it('should send request with const request params', async () => {
        const response: AxiosResponse = await testClient.requestForConstParamsTest();
        expect(response.config.url).to.be.eq('https://api.jisuapi.com/ip/location');
        expect(response.config.params.appKey).to.be.eq('appKey');
        expect(response.config.data).to.be.eq('{"data":"data"}');
        expect(response.config.headers['test-header']).to.be.eq('header');
    });
});
