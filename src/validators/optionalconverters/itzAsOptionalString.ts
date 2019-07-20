import { OPTIONAL_DEFAULT, ValidatorReturn } from '../../itz';

export function itzAsOptionalString(key: string, value: any): ValidatorReturn<string | undefined> {
    switch (typeof value) {
        case 'string':
        // fallthrough
        case 'number':
        // fallthrough
        case 'boolean':
            return [true, '' + value];
        default:
            return OPTIONAL_DEFAULT;
    }
}
