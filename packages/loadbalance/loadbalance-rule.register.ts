import { Injectable } from '@nestjs/common';
import { UseRules } from './decorators/use-rules.decorator';
import { RandomRule } from './rules/random.rule';
import { WeightedResponseTimeRule } from './rules/weighted-response-time.rule';
import { RoundRobinRule } from './rules/round-robin.rule';

@Injectable()
@UseRules(RandomRule, RoundRobinRule, WeightedResponseTimeRule)
export class LoadbalanceRuleRegister {
}
