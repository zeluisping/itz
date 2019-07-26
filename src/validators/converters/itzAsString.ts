import { InvalidValue, ValidatorReturn } from '../../itz';

export function itzAsString(key: string, value: any): ValidatorReturn<string> {
    switch (typeof value) {
        case 'string':
        case 'number':
        case 'boolean':
            return [true, '' + value];
        default:
    }
    return InvalidValue;
}
