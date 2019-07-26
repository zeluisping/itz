import { InvalidValue, ValidatorReturn } from '../itz';

export function itzBoolean(key: string, value: any): ValidatorReturn<boolean> {
    if (typeof value === 'boolean') {
        return [true, value];
    }
    return InvalidValue;
}

export function itzNumber(key: string, value: any): ValidatorReturn<number> {
    if (typeof value === 'number') {
        return [true, value];
    }
    return InvalidValue;
}

export function itzString(key: string, value: any): ValidatorReturn<string> {
    if (typeof value === 'string') {
        return [true, value];
    }
    return InvalidValue;
}

export function itzObject(key: string, value: any): ValidatorReturn<object> {
    if (typeof value === 'object') {
        return [true, value];
    }
    return InvalidValue;
}

export function itzNull(key: string, value: any): ValidatorReturn<null> {
    if (value === null) {
        return [true, null];
    }
    return InvalidValue;
}

export function itzUndefined(key: string, value: any): ValidatorReturn<undefined> {
    if (typeof value === 'undefined') {
        return [true, undefined];
    }
    return InvalidValue;
}

export function itzAny(key: string, value: any): readonly [true, any] {
    return [true, value];
}
