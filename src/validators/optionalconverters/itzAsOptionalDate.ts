import { OptionalValue, ValidatorReturn } from '../../itz';

export function itzAsOptionalDate(key: string, value: any): ValidatorReturn<Date | undefined> {
    if (value instanceof Date) {
        return [true, value];
    }
    if (typeof value === 'number' || typeof value === 'string') {
        const date = new Date(value);
        if (isNaN(date.getTime()) === false) {
            return [true, date];
        }
    }
    return OptionalValue;
}
