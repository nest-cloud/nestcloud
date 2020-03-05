import { Injectable } from '@nestjs/common';
import { Rule } from './interfaces/rule.interface';

@Injectable()
export class LoadbalanceRuleRegistry {
    private readonly rules = new Map<string, Rule>();
    private readonly refs: Function[] = [];

    public addRule(name: string, rule: Rule) {
        if (!this.rules.has(name)) {
            this.rules.set(name, rule);
            this.refs.forEach(ref => ref());
        }
    }

    public getRule(name: string): Rule | undefined {
        return this.rules.get(name);
    }

    public watch(ref: () => void) {
        this.refs.push(ref);
    }
}
