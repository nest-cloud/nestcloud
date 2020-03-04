import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LOADBALANCE_CHOOSE, RULES_METADATA } from './loadbalance.constants';
import { ChooseMetadata } from './interfaces/choose-metadata.interface';

@Injectable()
export class LoadbalanceMetadataAccessor {
    constructor(
        private readonly reflector: Reflector,
    ) {
    }

    getChooses(target: Function): ChooseMetadata[] | undefined {
        try {
            return this.reflector.get(LOADBALANCE_CHOOSE, target);
        } catch (e) {
            return;
        }
    }

    getRules(target: Function): Function[] | undefined {
        try {
            return this.reflector.get(RULES_METADATA, target);
        } catch (e) {
            return;
        }
    }
}
