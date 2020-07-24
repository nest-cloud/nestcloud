import * as YAML from 'yamljs';
import { KeyValueOptions } from '../interfaces/key-value-options.interface';

export function setValue(target: Function, value: any, property: string, options: KeyValueOptions = { type: 'text' }) {
    if (options.type === 'json') {
        try {
            value = JSON.parse(value);
        } catch (e) {
            value = options.defaults;
        }
    } else if (options.type === 'yaml') {
        try {
            value = YAML.parse(value);
        } catch (e) {
            value = options.defaults;
        }
    }
    target.constructor.prototype[property] = value ?? options.defaults;
}
