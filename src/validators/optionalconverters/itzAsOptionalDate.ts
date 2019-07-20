import { OPTIONAL_DEFAULT, ValidatorReturn } from '../../itz';

export function itzAsOptionalDate(key: string, value: any): ValidatorReturn<Date | undefined> {
    if (typeof value !== 'number' && typeof value !== 'string') {
        return OPTIONAL_DEFAULT;
    }
    const date = new Date(value);
    return isNaN(date.getTime()) ? OPTIONAL_DEFAULT : [true, date];
}
