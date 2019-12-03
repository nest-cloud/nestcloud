
[travis-image]: https://api.travis-ci.org/nest-cloud/nestcloud.svg?branch=master
[travis-url]: https://travis-ci.org/nest-cloud/nestcloud
[linux-image]: https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux
[linux-url]: https://travis-ci.org/nest-cloud/nestcloud

# NestCloud - Rbac

<p align="center">
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/v/@nestcloud/core.svg" alt="NPM Version"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/l/@nestcloud/core.svg" alt="Package License"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/dm/@nestcloud/core.svg" alt="NPM Downloads"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://travis-ci.org/nest-cloud/nestcloud.svg?branch=master" alt="Travis"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux" alt="Linux"/></a>
    <a href="https://coveralls.io/github/nest-cloud/nestcloud?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nest-cloud/nestcloud/badge.svg?branch=master" alt="Coverage"/></a>
</p>

## Description

Provides rbac for nestcloud.

## Installation

```bash
$ npm i --save @nestcloud/rbac
```

## Usage

```typescript
import { Module } from '@nestjs/common';
import { NEST_BOOT, NEST_CONSUL } from '@nestcloud/common';
import { BootModule } from '@nestcloud/boot';
import { ConsulModule } from '@nestcloud/consul';
import { Backend, ConsulValidator, RbacModule } from '@nestcloud/rbac';
import { HeroController } from './hero.controller';

@Module({
    imports: [
        BootModule.register(__dirname, `config.yaml`),
        ConsulModule.register({ dependencies: [NEST_BOOT] }),
        RbacModule.register({
            dependencies: [NEST_CONSUL, NEST_BOOT],
            backend: Backend.CONSUL,
            validator: ConsulValidator,
        })
    ],
    controllers: [HeroController],
})
export class AppModule {
}
```

### Boot Configuration

```yaml
consul:
  host: localhost
  port: 8500
rbac:
  parameters:
    name: service-rbac
```

### Rbac Configuration

The Rbac configuration has three kinds: Account, Role, RoleBinding and use '---' split these.

Please set the rbac configuration into consul kv named service-rbac.

```yaml
kind: Account
name: test

---

kind: Role
name: admin
rules:
  - resources: ["user"]
    verbs: ["get", "list"]
    
---

kind: RoleBinding
role: admin
accounts:
  - test
```

### Write A Guard

Put a user object into request instance. The RbacGuard need it for permission validation.

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { IRbacAccount } from '@nestcloud/rbac';

@Injectable()
export class AccountGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        request.user = { name: request.query.user } as IRbacAccount;
        return true;
    }
}

```

### Define Resource And Verb in Controller

Your custom AccountGuard must be set before RbacGuard.

```typescript
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AccountGuard } from './account.guard';
import { RbacGuard, Resource, Verb, Verbs } from '@nestcloud/rbac';

@Controller('/users')
@Resource('user')
@UseGuards(AccountGuard, RbacGuard)
export class HeroController {
    @Get('/:userId')
    @Verb(Verbs.GET)
    async get(@Param('heroId') heroId: number): Promise<any> {
        return { user: 'Shadow hunter' };
    }

    @Get('/')
    @Verb(Verbs.LIST)
    async list(): Promise<any> {
        return { users: ['Shadow hunter', 'BladeMaster'] };
    }
}
```

## Use Custom Validator

The rbac component use ConsulValidator as default validator,
 if you don't want to use consul as storage backend, 
 you can write a custom validator.
 
```typescript
import { IRbacValidator } from "./interfaces/rbac-validator.interface";
import { IRbacAccount } from "./interfaces/rbac-account.interface";
import { IRbacRole } from "./interfaces/rbac-role.interface";
import { IRbacRoleBinding } from "./interfaces/rbac-role-binding.interface";
import { Store } from "./store";
import { IRbacConfig } from "./interfaces/rbac-config.interface";

export class CustomValidator implements IRbacValidator {
    private readonly store: Store = new Store();

    /**
    * 
    * @param config
    * @param client 
    * If set config.backend to Backend.CONSUl, the client will be consul instance;
    * if set config.backend to Backend.LOADBALANCE, the client will be loadbalance instance;
    * if set config.backend to Backend.CUSTOM or not set, the client will be null.
    */
    public async init(config: IRbacConfig, client?: any) {
        const roles: IRbacRole[] = [];
        const accounts: IRbacAccount[] = [];
        const roleBindings: IRbacRoleBinding[] = [];
        this.store.init(accounts, roles, roleBindings);
    }
    
    public validate(resource: string, verb: string, account: IRbacAccount): boolean {
        return this.store.validate(account.name, resource, verb);
    }
}

```

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
