import { ValidatorReturn, INVALID_VALUE } from '../../itz';

export function itzAsNumber(key: string, value: any): ValidatorReturn<number> {
    return (typeof value === 'string' && isNaN(+value) === false) ||
        typeof value === 'number' ||
        typeof value === 'boolean'
        ? [true, +value]
        : INVALID_VALUE;
}
