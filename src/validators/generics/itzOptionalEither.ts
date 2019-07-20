import { Validator } from '../../itz';
import { ValidatorArray, ValidatorArrayInfer } from './itzEither';

export function itzOptionalEither<R extends ValidatorArray<any>>(...rest: R): Validator<ValidatorArrayInfer<R>> {
    return (key, value) => {
        for (const fn of rest) {
            const r = fn(key, value);
            if (r[0] === true) {
                return r;
            }
        }
        return [true, undefined];
    };
}
