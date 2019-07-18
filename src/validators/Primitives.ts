import { ValidatorReturn } from '../itz';

export function itzBoolean(key: string, value: any): ValidatorReturn<boolean> {
    return typeof value === 'boolean' ? [true, value] : [false, undefined];
}

export function itzNumber(key: string, value: any): ValidatorReturn<number> {
    return typeof value === 'number' ? [true, value] : [false, undefined];
}

export function itzString(key: string, value: any): ValidatorReturn<string> {
    return typeof value === 'string' ? [true, value] : [false, undefined];
}

export function itzObject(key: string, value: any): ValidatorReturn<object> {
    return typeof value === 'object' ? [true, value] : [false, undefined];
}

export function itzNull(key: string, value: any): ValidatorReturn<null> {
    return value === null ? [true, null] : [false, undefined];
}

export function itzUndefined(key: string, value: any): ValidatorReturn<undefined> {
    return typeof value === 'undefined' ? [true, undefined] : [false, undefined];
}

export function itzAny(key: string, value: any): readonly [true, any] {
    return [true, value];
}
