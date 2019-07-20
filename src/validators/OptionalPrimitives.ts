import { OPTIONAL_DEFAULT, ValidatorReturn } from '../itz';

export function itzOptionalBoolean(key: string, value: any): ValidatorReturn<boolean | undefined> {
    return typeof value === 'boolean' ? [true, value] : OPTIONAL_DEFAULT;
}

export function itzOptionalNumber(key: string, value: any): ValidatorReturn<number | undefined> {
    return typeof value === 'number' ? [true, value] : OPTIONAL_DEFAULT;
}

export function itzOptionalString(key: string, value: any): ValidatorReturn<string | undefined> {
    return typeof value === 'string' ? [true, value] : OPTIONAL_DEFAULT;
}

export function itzOptionalObject(key: string, value: any): ValidatorReturn<object | undefined> {
    return typeof value === 'object' ? [true, value] : OPTIONAL_DEFAULT;
}

export function itzOptionalNull(key: string, value: any): ValidatorReturn<null | undefined> {
    return value === null ? [true, null] : OPTIONAL_DEFAULT;
}
