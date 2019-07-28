import { OptionalValue, Validator } from '../../itz';

export function itzOptional<T>(validator: Validator<T>): Validator<T | undefined> {
    return (key, value) => {
        const r = validator(key, value);
        if (r[0] === true) {
            return r;
        }
        return OptionalValue;
    };
}
