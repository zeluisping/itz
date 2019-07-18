import { ValidatorReturn } from '../../itz';

export function itzAsDate(key: string, value: any): ValidatorReturn<Date> {
    if (typeof value !== 'number' && typeof value !== 'string') {
        return [false, undefined];
    }
    const date = new Date(value);
    return isNaN(date.getTime()) ? [false, undefined] : [true, date];
}
