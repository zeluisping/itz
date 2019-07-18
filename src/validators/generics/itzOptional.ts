import { Validator } from '../../itz';

export function itzOptional<T>(validator: Validator<T>): Validator<T | undefined> {
    return (key, value) => {
        const r = validator(key, value);
        return r[0] === true ? r : [true, undefined];
    };
}
