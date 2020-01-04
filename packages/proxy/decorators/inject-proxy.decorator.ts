import { Inject } from '@nestjs/common';
import { Proxy } from '../proxy';

export const InjectProxy = () => Inject(Proxy);
