import { Validator } from '../../itz';

export function itzDefault<T, X extends Exclude<T, undefined>>(
    validator: Validator<T>,
    Default: X,
): (key: string, value: any) => readonly [true, X] {
    return (key, value) => {
        const r = validator(key, value);
        if (r[0] === true && typeof r[1] !== 'undefined') {
            return r as [true, X];
        }
        return [true, Default];
    };
}
