import { INVALID_VALUE, ValidatorReturn } from '../../itz';

export function itzAsDate(key: string, value: any): ValidatorReturn<Date> {
    if (typeof value !== 'number' && typeof value !== 'string') {
        return INVALID_VALUE;
    }
    const date = new Date(value);
    return isNaN(date.getTime()) ? INVALID_VALUE : [true, date];
}
