import { Boot } from './boot.class';
import { writeFileSync, unlinkSync } from 'fs';
import { resolve } from 'path';
import { expect } from 'chai';

describe('Consul Config Store', () => {
    const filename = 'config-test.yaml';
    const config = `
web:
  service: user-service
  port: 3000    
    `;
    let boot: Boot;
    before(async () => {
        writeFileSync(resolve(__dirname, filename), config);
        boot = new Boot(__dirname, filename);
    });

    it(`boot.get()`, () => {
        expect(boot.get<number>('web.port')).equal(3000);
    });

    after(async () => {
        unlinkSync(resolve(__dirname, filename));
    });
});
