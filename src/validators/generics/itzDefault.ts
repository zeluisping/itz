import { Validator } from '../../itz';

export function itzDefault<T>(validator: Validator<T>, Default: T): Validator<T> {
    return (key, value) => {
        const r = validator(key, value);
        if (r[0] === true) {
            return r;
        }
        return [true, Default];
    };
}
