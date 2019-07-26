import { InvalidValue, ValidatorReturn } from '../../itz';

export function itzAsBoolean(key: string, value: any): ValidatorReturn<boolean> {
    switch (typeof value) {
        case 'boolean':
        case 'number':
            return [true, !!value];
        case 'string':
            if (value === 'true' || value === '1') {
                return [true, true];
            }
            if (value === 'false' || value === '0') {
                return [true, false];
            }
        // falls through
        default:
    }
    return InvalidValue;
}
