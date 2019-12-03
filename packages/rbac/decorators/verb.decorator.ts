import { SetMetadata } from '@nestjs/common';
import { VERB_METADATA } from '../constants';

export const Verb = (verb: string) => SetMetadata(VERB_METADATA, verb);
