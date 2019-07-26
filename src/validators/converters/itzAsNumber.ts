import { InvalidValue, ValidatorReturn } from '../../itz';

export function itzAsNumber(key: string, value: any): ValidatorReturn<number> {
    switch (typeof value) {
        case 'string':
            if (isNaN(+value) === true) {
                break;
            }
        // falls through
        case 'number':
        case 'boolean':
            return [true, +value];
        default:
    }
    return InvalidValue;
}
