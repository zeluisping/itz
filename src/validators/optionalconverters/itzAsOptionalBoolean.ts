import { OptionalValue, ValidatorReturn } from '../../itz';

export function itzAsOptionalBoolean(key: string, value: any): ValidatorReturn<boolean | undefined> {
    switch (typeof value) {
        case 'boolean':
        // fallthrough
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
    return OptionalValue;
}
