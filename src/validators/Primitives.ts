import { INVALID_VALUE, ValidatorReturn } from '../itz';

export function itzBoolean(key: string, value: any): ValidatorReturn<boolean> {
    return typeof value === 'boolean' ? [true, value] : INVALID_VALUE;
}

export function itzNumber(key: string, value: any): ValidatorReturn<number> {
    return typeof value === 'number' ? [true, value] : INVALID_VALUE;
}

export function itzString(key: string, value: any): ValidatorReturn<string> {
    return typeof value === 'string' ? [true, value] : INVALID_VALUE;
}

export function itzObject(key: string, value: any): ValidatorReturn<object> {
    return typeof value === 'object' ? [true, value] : INVALID_VALUE;
}

export function itzNull(key: string, value: any): ValidatorReturn<null> {
    return value === null ? [true, null] : INVALID_VALUE;
}

export function itzUndefined(key: string, value: any): ValidatorReturn<undefined> {
    return typeof value === 'undefined' ? [true, undefined] : INVALID_VALUE;
}

export function itzAny(key: string, value: any): readonly [true, any] {
    return [true, value];
}
