import { OPTIONAL_DEFAULT, ValidatorReturn } from '../../itz';

export function itzAsOptionalNumber(key: string, value: any): ValidatorReturn<number | undefined> {
    return (typeof value === 'string' && isNaN(+value) === false) ||
        typeof value === 'number' ||
        typeof value === 'boolean'
        ? [true, +value]
        : OPTIONAL_DEFAULT;
}
