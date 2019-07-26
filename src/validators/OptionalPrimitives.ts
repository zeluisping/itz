import { OptionalValue, ValidatorReturn } from '../itz';

export function itzOptionalBoolean(key: string, value: any): ValidatorReturn<boolean | undefined> {
    if (typeof value === 'boolean') {
        return [true, value];
    }
    return OptionalValue;
}

export function itzOptionalNumber(key: string, value: any): ValidatorReturn<number | undefined> {
    if (typeof value === 'number') {
        return [true, value];
    }
    return OptionalValue;
}

export function itzOptionalString(key: string, value: any, Default?: string): ValidatorReturn<string | undefined> {
    if (typeof value === 'string') {
        return [true, value];
    }
    return OptionalValue;
}

export function itzOptionalObject(key: string, value: any, Default?: object): ValidatorReturn<object | undefined> {
    if (typeof value === 'object') {
        return [true, value];
    }
    return OptionalValue;
}

export function itzOptionalNull(key: string, value: any): ValidatorReturn<null | undefined> {
    if (value === null) {
        return [true, value];
    }
    return OptionalValue;
}
