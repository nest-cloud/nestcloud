import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RESOURCE_METADATA, VERB_METADATA } from './constants';
import { IRbacAccount } from './interfaces/rbac-account.interface';
import { InjectRbac } from './decorators/inject-rbac.decorator';
import { Rbac } from './rbac';
import { IRbacValidator } from './interfaces/rbac-validator.interface';

@Injectable()
export class RbacGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        @InjectRbac() private readonly rbac: Rbac,
    ) {
    }

    canActivate(context: ExecutionContext): boolean {
        const methodResource = this.reflector.get<string>(RESOURCE_METADATA, context.getHandler());
        const clsResource = this.reflector.get<string>(RESOURCE_METADATA, context.getClass());
        const verb = this.reflector.get<string>(VERB_METADATA, context.getHandler());
        const resource = methodResource || clsResource;
        if (!resource || !verb) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user: IRbacAccount = request.user;
        if (!user) {
            return false;
        }
        const validator: IRbacValidator = this.rbac.getValidator();
        if (!validator) {
            throw new ForbiddenException('Cannot find an available validator');
        }

        return validator.validate(resource, verb, user);
    }
}
