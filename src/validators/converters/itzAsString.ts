import { ValidatorReturn } from '../../itz';

export function itzAsString(key: string, value: any): ValidatorReturn<string> {
    switch (typeof value) {
        case 'string':
        // fallthrough
        case 'number':
        // fallthrough
        case 'boolean':
            return [true, '' + value];
        default:
            return [false, undefined];
    }
}
